import { SerialPort } from 'serialport';
import { serialConfig } from './src/config/serial.config';
import { DelimiterParser } from '@serialport/parser-delimiter';
import axios from 'axios';

const port = new SerialPort({ path: `${serialConfig.port}`, baudRate: serialConfig.baudRate });
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

const onclose = () => {
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

port.on('close', onclose );

//requests
const handleChunk = (data: string) => {

    try {
        const dataString = data.toString();
        const requestType = dataString.split(':')[0];
        const request = dataString.length > 1 ? dataString.split(':')[1] : null;
        switch (requestType) {
        case 'MESSAGE':
            handleNewMessage(request);
            break;
        default:
            console.log('Unknown request type');
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
        console.log('New message: ', message);
        const messageObjectBody = JSON.parse(message);
        const password = serialConfig.password;
        //send message to server
        axios.post('http://localhost:${PORT}/api/messages', { ...messageObjectBody, password }).then((response) => {
            const responseData: SerialMessageResponse = response.data;
            console.log('Messages saved with ids: ', responseData.messageId);
        }).catch((error) => {
            console.log('Error: ', error);
        });

    } else {
        console.log('Empty message');
    }
};

