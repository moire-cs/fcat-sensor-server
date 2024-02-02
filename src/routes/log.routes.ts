import { Express } from 'express';
import * as logController from '../controllers/log.controller';

const URL_BASE = '/api/log';

export const useLogRoutes = (router:Express) => {
    router.get(URL_BASE, logController.getLogs);
    router.get(URL_BASE + '/:id', logController.getLog);
    router.post(URL_BASE + '/', logController.createLog);
};