import express from 'express';
import cors from 'cors';
import path from 'path';
import { sequelize } from './src/models/db.index';
import { useMessageRoutes } from './src/routes/messages.routes';
import { useUserRoutes } from './src/routes/users.routes';
import { useCycleRoutes } from './src/routes/cycle.routes';
import { usePlotRoutes } from './src/routes/plots.routes';

const app = express();

const corsOptions = {
    origin: 'http://localhost:8081/',
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

useMessageRoutes(app);
useUserRoutes(app);
useCycleRoutes(app);
usePlotRoutes(app);

const PORT = process.env.PORT || 8080;

if (process.env.IS_PROD === 'true') {
    app.use(express.static(path.join(__dirname, 'build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

sequelize.sync();

export default app;
