import 'dotenv/config';
import { SerialPort } from 'serialport';
import { DelimiterParser } from '@serialport/parser-delimiter';
import { serialConfig } from './src/config/serial.config';
import axios from 'axios';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const PORT = 8080;
let port: SerialPort;

const waitForServer = async () => {
    let serverUp = false;
    while (!serverUp) {
        try {
            await axios.get(`http://localhost:${PORT}/api/cycle`);
            serverUp = true;
            console.log('Server is up');
        } catch (error) {
            console.log('Waiting for server...');
            await wait(5000);
        }
    }
    port = new SerialPort({ path: serialConfig.port, baudRate: serialConfig.baudRate });
    port.on('error', (err) => {
        console.log('Error: ', err.message);
        onclose();
    });
    port.on('open', () => {
        console.log(`Serial port ${serialConfig.port} is open at ${serialConfig.baudRate} baud rate.`);
    });
    const parser = port.pipe(new DelimiterParser({ delimiter: '\n' }));
    parser.on('data', (data) => {
        handleChunk(data.toString());
    });
    port.on('close', onclose);
};

waitForServer();

const onclose = () => {
    console.log('BACKEND: Serial port closed, retrying in 5 seconds...');
    setTimeout(() => {
        port.open((err) => {
            if (err) {
                console.log('Error: ', err.message);
                onclose();
            }
        });
    }, 5000);
};

// Parse: MOIRE,7962B275,22.62,68.40,30.07,10157,3.85
// Format: MOIRE,ID,temp,humidity,lux,pulse,battery
const handleChunk = async (data: string) => {
    try {
        const line = data.toString().replace(/\x1B\[[0-9;]*m/g, '').replace(/\r/g, '').trim();
        console.log('Received:', line);

        if (!line.startsWith('MESSAGE:')) return;

        let parsed: { nodeId: string; sensors: string[]; messages: number[][] };
        try {
            parsed = JSON.parse(line.substring('MESSAGE:'.length));
        } catch (e) {
            console.log('Invalid JSON in MESSAGE:', line);
            return;
        }

        const { sensors, messages } = parsed;
        const nodeId = parsed.nodeId.replace(/^0x/i, '');

        if (!nodeId || !sensors?.length || !messages?.length) {
            console.log('Missing required fields in MESSAGE:', line);
            return;
        }

        const now = new Date().getTime() / 1000;

        const payload = {
            password: serialConfig.password,
            nodeId: nodeId,
            times: messages.map(() => now),
            sensors: sensors.map(Number),
            messages: messages,
        };
        console.log('BACKEND: Sending payload:', JSON.stringify(payload));
        console.log('BACKEND: About to post...');
        const response = await axios.post(`http://localhost:${PORT}/api/messages`, payload);
        console.log('BACKEND: Response:', response.status, JSON.stringify(response.data));

    } catch (error) {
        console.log('Error handling chunk:', String(error));
    }
};
