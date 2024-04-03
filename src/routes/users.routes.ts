import { Express } from 'express';
import * as usersController from '../controllers/users.controller';

const URL_BASE = '/api/users';
const AUTH = usersController.authenticate;

export const useUserRoutes = (router:Express) => {
    router.post(URL_BASE + '/login', usersController.login);
    router.post(URL_BASE + '/register', usersController.register);
    router.post(URL_BASE + '/logout', AUTH, usersController.logout);
    router.get(URL_BASE, AUTH, usersController.getUsers);
    router.get(URL_BASE + '/:id', AUTH, usersController.getUser);
    router.delete(URL_BASE + '/deleteUser/:id', AUTH, usersController.deleteUser);
    router.get(URL_BASE + '/:email', AUTH, usersController.getUserByEmail);
    router.get(URL_BASE + '/:name', AUTH, usersController.getUserByName);
};