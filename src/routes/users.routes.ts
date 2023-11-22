import { Express } from 'express';
import * as usersController from '../controllers/users.controller';
const URL_BASE = '/api/users';
export const useUserRoutes = (router:Express) => {
    router.post(URL_BASE + '/login', usersController.login);
    router.post(URL_BASE + '/register', usersController.register);
    router.post(URL_BASE + '/logout', usersController.logout);
};
