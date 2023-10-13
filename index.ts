import express from 'express';
import cors from 'cors';
import { sequelize } from './src/models/db.index';

const app = express();

const corsOptions = {
    origin: 'http://localhost:8081',
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ message: 'Moire hell yeah we be makin sensors and stuff' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
sequelize.sync();