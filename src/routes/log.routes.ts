import { Express } from 'express';
import * as logController from '../controllers/log.controller';
import { authenticate } from '../controllers/users.controller';

const URL_BASE = '/api/log';
const AUTH = authenticate;

export const useLogRoutes = (router:Express) => {
    router.get(URL_BASE, AUTH, logController.getLogs);
    router.get(URL_BASE + '/:id', AUTH, logController.getLog);
    router.post(URL_BASE + '/', AUTH, logController.createLog);
};