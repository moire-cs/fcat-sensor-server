import { usersDB } from '../models/db.index';
import { RequestHandler } from 'express';
import createHttpError from 'http-errors';

export const getUsers: RequestHandler = async (req, res, errFunc) => {
    try {
        const users = await usersDB.findAll();
        res.status(200).json(users);
    } catch (error) {
        errFunc(error);
    }
};

export const getUser: RequestHandler = async (req, res, errFunc) => {
    const id = req.params.id;

    try {
        const user = await usersDB.findByPk(id);

        if (!user) {
            throw createHttpError(400, 'User not found');
        }

        res.status(200).json(user);
    } catch (error) {
        errFunc(error);
    }
};

interface CreateUserBody {
    id: string,
    name: string,
    password: string,
    admin?: boolean,
    email: string,
    preferences?: string,
}

export const createUser: RequestHandler<unknown, unknown, CreateUserBody, unknown> = async (req, res, errFunc) => {
    const id = req.body.id;
    const name = req.body.name;
    const password = req.body.password;
    const admin = req.body.admin;
    const email = req.body.email;
    const preferences = req.body.preferences;

    try {
        if (!id) {
            throw createHttpError(400, 'User must have an id');
        }

        if (!name) {
            throw createHttpError(400, 'User must have a name');
        }

        if (!password) {
            throw createHttpError(400, 'User must have a password');
        }

        if (!email) {
            throw createHttpError(400, 'User must have an email');
        }

        const newUser = await usersDB.create({
            id: id,
            name: name,
            password: password,
            admin: admin,
            email: email,
            preferences: preferences,
        });

        res.status(201).json(newUser);
    } catch (error) {
        errFunc(error);
    }
};

interface UpdateUserParams {
    id: string,
}

interface UpdateUserBody {
    id: string,
    name: string,
    password: string,
    admin?: boolean,
    email: string,
    preferences?: string,
}

export const updateUser: RequestHandler<UpdateUserParams, unknown, UpdateUserBody, unknown> = async(req, res, errFunc) => {
    const id = req.body.id;
    const newName = req.body.name;
    const newPassword = req.body.password;
    const newAdmin = req.body.admin;
    const newEmail = req.body.email;
    const newPreferences = req.body.preferences;

    try {
        const user = await usersDB.findByPk(id);

        if (!user) {
            throw createHttpError(400, 'User not found');
        }

        if (!newName) {
            throw createHttpError(400, 'User must have a name');
        }

        if (!newPassword) {
            throw createHttpError(400, 'User must have a password');
        }

        if (!newEmail) {
            throw createHttpError(400, 'User must have a email');
        }

        user.setDataValue('name', newName);
        user.setDataValue('password', newPassword);
        user.setDataValue('admin', newAdmin);
        user.setDataValue('email', newEmail);
        user.setDataValue('preferences', newPreferences);

        const updatedPlot = await user.save();

        res.status(200).json(updatedPlot);
    } catch (error) {
        errFunc(error);
    }
};

interface DeleteUserParams {
    id: string;
}

export const deleteUser: RequestHandler<DeleteUserParams, unknown, unknown, unknown> = async (req, res, errFunc) => {
    const id = req.params.id;

    try {
        const user = await usersDB.findByPk(id);

        if (!user) {
            throw createHttpError(404, 'User not found');
        }

        await user.destroy();

        res.status(204).send();
    } catch (error) {
        errFunc(error);
    }
};

interface GetUserByEmailParams {
    email: string;
}

export const getUserByEmail: RequestHandler<GetUserByEmailParams, unknown, unknown, unknown> = async (req, res, errFunc) => {
    const email = req.params.email;

    try {
        const user = await usersDB.findAll({
            where: {
                email: email,
            },
        });

        if (!user) {
            throw createHttpError(400, 'User not found');
        }

        res.status(200).json(user);
    } catch (error) {
        errFunc(error);
    }
};

interface GetUserByNameParams {
    name: string;
}

export const getUserByName: RequestHandler<GetUserByNameParams, unknown, unknown, unknown> = async (req, res, errFunc) => {
    const name = req.params.name;

    try {
        const user = await usersDB.findAll({
            where: {
                name: name,
            },
        });

        if (!user) {
            throw createHttpError(404, 'User not found');
        }

        res.status(200).json(user);
    } catch (error) {
        errFunc(error);
    }
};