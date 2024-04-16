import { SerialPort } from 'serialport';
import { serialConfig } from './src/config/serial.config';
import { DelimiterParser } from '@serialport/parser-delimiter';
import fs from 'fs';

const port = new SerialPort({ path: `/dev/${serialConfig.port}`, baudRate: serialConfig.baudRate });
const logFile = fs.createWriteStream('log.txt', { flags: 'a' });
port.on('error', (err) => {
    console.log('Error: ', err.message);
});
port.on('open', () => {
    console.log(`Serial port ${serialConfig.port} is open at ${serialConfig.baudRate} baud rate.`);
});
// example line: 'MESSAGE: { "nodeId": number, "time": number, "sensors": Array<number> messages:Array<Array<number>>}  \n}
const parser = port.pipe(new DelimiterParser({ delimiter: '\n' }));
parser.on('data', (data) => {
    handleChunk(data.toString());
});

//requests
const handleChunk = (data: string) => {

    try {
        const dataString = data.toString();
        // const requestType = dataString.split(':')[0];
        // const request = dataString.split(':')[1];
        // switch (requestType) {
        // case 'MESSAGE':
        //     // handleNewMessage(request);
        //     break;
        // default:
        //     console.log('Unknown request type');
        // }
        const currentTime = new Date().toISOString();

        console.log(`[${currentTime}] ${dataString}`);
        logFile.write(`[${currentTime}] ${dataString}\n`);

    }
    catch (error) {
        console.log('Error: ', error);
    }

};

