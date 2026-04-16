export const serialConfig = {
    port: process.env.SERIAL_PORT || '/dev/ttyACM1',
    baudRate: 115200,
    password: process.env.SERIAL_PASSWORD || '',
};
