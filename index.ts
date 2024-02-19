import express  from 'express';
import cors from 'cors';
import { sequelize } from './src/models/db.index';
import { useMessageRoutes } from './src/routes/messages.routes';
import { useUserRoutes } from './src/routes/users.routes';

const app = express();

const corsOptions = {
    origin: 'http://localhost:8081/',
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// app.use('/', (req, res) => {
//     res.json({ message: 'Moire hell yeah we be makin sensors and stuff' });
// });

// app.use((req, res, errFunc) => {
//     errFunc(createHttpError(404, 'Endpoint not found'));
// });

// // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
// app.use((error: unknown, req: Request, res: Response, errFunc: NextFunction) => {
//     console.log(error);
//     let errorMessage = 'An unknown error occurred!';
//     let statusCode = 500;
//     if (isHttpError(error)) {
//         statusCode = error.status;
//         errorMessage = error.message;
//     }
//     res.status(statusCode).json({ error: errorMessage });
// });
useMessageRoutes(app);
useUserRoutes(app);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

sequelize.sync();

export default app;