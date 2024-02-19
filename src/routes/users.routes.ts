import { Express } from 'express';
import * as usersController from '../controllers/users.controller';
const URL_BASE = '/api/users';
export const useUserRoutes = (router:Express) => {
    router.post(URL_BASE + '/login', usersController.login);
    router.post(URL_BASE + '/register', usersController.register);
    router.post(URL_BASE + '/logout', usersController.logout);
    router.get(URL_BASE, usersController.getUsers);
    router.get(URL_BASE + '/:id', usersController.getUser);
    router.post(URL_BASE + '/', usersController.createUser);
    router.patch(URL_BASE + '/updateUser/:id', usersController.updateUser);
    router.delete(URL_BASE + '/deleteUser/:id', usersController.deleteUser);
    router.get(URL_BASE + '/:email', usersController.getUserByEmail);
    router.get(URL_BASE + '/:name', usersController.getUserByName);
};