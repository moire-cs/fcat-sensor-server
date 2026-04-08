import { SerialPort } from 'serialport';
import { DelimiterParser } from '@serialport/parser-delimiter';
import axios from 'axios';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const PORT = 8080;
let port: SerialPort;

const serialConfig = {
    port: process.env.SERIAL_PORT || '/dev/ttyACM0',
    baudRate: 115200,
    password: 'RANDOM_GUID'
};

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

        if (!line.startsWith('MOIRE,')) return;
        	console.log('MOIRE detected! Parts count:', line.split(',').length, 'Line:', line);
        	const parts = line.split(',');
        if (parts.length !== 7) {
            console.log('Invalid MOIRE data:', line);
            return;
        }

        const nodeId = parts[1];
        const temp = parseFloat(parts[2]);
        const humidity = parseFloat(parts[3]);
        const lux = parseFloat(parts[4]);
        const pulse = parseFloat(parts[5]);
        const battery = parseFloat(parts[6]);

        if (isNaN(temp) || isNaN(humidity) || isNaN(lux) || isNaN(pulse) || isNaN(battery)) {
            console.log('Invalid sensor values:', line);
            return;
        }

        const now = new Date().getTime() / 1000;

        const payload = {
            password: serialConfig.password,
            nodeId: nodeId,
            times: [now],
            sensors: [1, 2, 3, 0, 4],
            messages: [[temp, humidity, lux, pulse, battery]],
        };
	console.log('BACKEND: Sending payload:', JSON.stringify(payload));
	console.log('BACKEND: About to post...');
	const response = await axios.post(`http://localhost:${PORT}/api/messages`, payload);
	console.log('BACKEND: Response:', response.status, JSON.stringify(response.data));

    } catch (error) {
        console.log('Error handling chunk:', String(error));
    }
};
