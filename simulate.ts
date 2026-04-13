import axios from 'axios';

const PORT = 8080;
const password = 'RANDOM_GUID';

const sendFakeData = async () => {
    const now = new Date().getTime() / 1000;

    const payload = {
        password: password,
        nodeId: '7962B275',
        times: [now],
        sensors: [1, 2, 3, 0,4],
        messages: [[22.62, 68.40, 30.07, 10157,3.85]],
    };

    console.log('Sending simulated MOIRE data:', payload);

    try {
        const response = await axios.post(`http://localhost:${PORT}/api/messages`, payload);
        console.log('Response:', response.data);
    } catch (error) {
        console.log('Error:', error);
    }
};

sendFakeData();
