import { SerialPort } from 'serialport';
import { serialConfig } from './src/config/serial.config';
import { DelimiterParser } from '@serialport/parser-delimiter';
import axios from 'axios';
import { CycleEntry } from './src/models/cycle.model';

//wait for the server to start
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
            await wait(5000);
        }
    }
    port = new SerialPort({ path: `${serialConfig.port}`, baudRate: serialConfig.baudRate });
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
    port.on('close', onclose );
};
waitForServer();

const onclose = () => {
    console.log('BACKEND: Serial port closed');
    //retry every 5 seconds
    setTimeout(() => {
        port.open((err) => {
            if (err) {
                console.log('Error: ', err.message);
                onclose();
            }
        });

    }, 5000);

};

//requests
const handleChunk = async (data: string) => {

    try {

        const dataString = data.toString();
        console.log(dataString);

        const requestType = dataString.split(':')[0];
        const delimIndex =  dataString.indexOf(':');
        const request = dataString.length > 1 ? dataString.substring(delimIndex + 1) : null;
        switch (requestType) {
        case 'MESSAGE':
            handleNewMessage(request);
            break;
        case 'CYCLE':
            console.log('BACKEND: Cycle request');
            handleCycleRequest();
            break;
        default:
            // console.log('Unknown request type: ' + dataString);
        }

    }
    catch (error) {
        console.log('Error: ', error);
    }

};

type SerialMessageResponse = {
	messageId:Array<string>;
	message: 'Messages Saved'
}
const handleNewMessage = (message: string|null) => {
    if (message) {
        console.log('BACKEND: New message: ', message);
        const messageObjectBody = JSON.parse(message);
        const parsedBody = {
            password: serialConfig.password,
            nodeId: messageObjectBody.nodeId,
            times: messageObjectBody.times,
            sensors: messageObjectBody.sensors,
            messages: messageObjectBody.messages,
        };
        if (parsedBody.messages.length === 0) {
            console.log('BACKEND: Empty message');
            return;
        }
        console.log('BACKEND: Parsed message: ', parsedBody);
        //send message to server
        axios.post(`http://localhost:${PORT}/api/messages`, parsedBody).then((response) => {
            const responseData: SerialMessageResponse = response.data;
            console.log('BACKEND: Messages saved with ids: ', responseData.messageId);
        }).catch((error) => {
            console.log('BACKEND: Error: ', error);
        });

    } else {
        console.log('Empty message');
    }
};

const handleCycleRequest = () =>
    axios.get(`http://localhost:${PORT}/api/cycle`).then((response) => {
        console.log('BACKEND: Cycle request response: ', response.data);
        const cycle = response.data as CycleEntry;
        // “{duration in hours}, {numMessages}, {gateTolerance}, {epoch time (seconds since 1970)}\n”
        port.write(`${cycle.duration / 3600}, ${cycle.numMessages}, ${cycle.gateTolerance}, ${cycle.syncDuration}, ${new Date().getTime() / 1000}\n`, (err) => {
            if (err) {
                console.log('BACKEND: Error: ', err.message);
            }
        });
        console.log('BACKEND: Cycle request sent');
    }).catch((error) => {
        console.log('BACKEND: Error: ', error);
    });
