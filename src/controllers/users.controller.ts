import { usersDB, sessionsDB } from '../models/db.index';
import Express from 'express';
import { User } from '../types/User';
import bcrypt from 'bcrypt';
import { v4 as guid } from 'uuid';
import { EXPIRATION_TIME, Session } from '../models/sessions.model';
import { RequestHandler } from 'express';
import createHttpError from 'http-errors';

type LoginBody = {email: string, password: string}
export const login = async (req: Express.Request, res: Express.Response) => {
    try {
        const body = req.body as LoginBody;
        if (!body.email || !body.password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const user = await usersDB.findOne({ where: { email:body.email } }).then((user) => user?.toJSON() as User);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(body.password, user.password);
        if (!isMatch){
            return res.status(401).json({ message:'Invalid credentials' });
        }
        //create token
        const token = guid();
        const hashedToken = await bcrypt.hash(token, 10);
        await sessionsDB.create({ token: hashedToken, userID: user.id, expires: Date.now() + EXPIRATION_TIME });

        res.json({ token, userId: user.id });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

export const logout = async (req: Express.Request, res: Express.Response) => {
    try {
        if (!req.body.email){
            return res.status(400).json({ message: 'Email is required' });
        }
        const { email }:{email:string} = req.body;
        const user = await usersDB.findOne({ where: { email } }).then((user) => user?.toJSON() as User);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await sessionsDB.destroy({ where: { userID: user.id } });
        res.json({ message: 'User logged out' });
    } catch (error) {
        res.status(500).json({ message: error });
    }

};

export const register = async (req: Express.Request, res: Express.Response) => {
    try {
        //check if name, password, email were provided
        if (!req.body.name || !req.body.password || !req.body.email) {
            return res.status(400).json({ message: 'Name, password, and email are required' });
        }

        const { name, password, email }:{name:string,password:string,email:string} = req.body;

        //name req: 3-100 chars
        if (RegExp(/^.{3,100}$/).test(name) === false ){
            return res.status(400).json({ message: 'Name must be 3-100 characters' });
        }
        //password req: 8-20 chars, 3 out of 4 of the following: 1 uppercase, 1 lowercase, 1 number, 1 special char
        if ((RegExp(/^(?=.*[a-z])(?=.{8,20})/).test(password) ? 1 : 0) +
            (RegExp(/^(?=.*[A-Z])(?=.{8,20})/).test(password) ? 1 : 0) +
            (RegExp(/^(?=.*[0-9])(?=.{8,20})/).test(password) ? 1 : 0) +
            (RegExp(/^(?=.*[!@#$%^&*])(?=.{8,20})/).test(password) ? 1 : 0) < 3 ){
            return res.status(400).json({ message: 'Password must be 8-20 characters and contain 3 of the following: 1 uppercase, 1 lowercase, 1 number, 1 special character' });
        }
        //email req: valid email
        if (RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(email) === false ){
            return res.status(400).json({ message: 'Invalid email' });
        }

        const user = await usersDB.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await usersDB.create({ name, password: hashedPassword, email, preferences:'{}' });
        res.status(201).json({ message:'User created' });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};
export const authenticate = async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    try {
        const token = req.headers.token as string;
        const userID = req.headers.userid as string;
        if (!token || !userID ) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await usersDB.findOne({ where:{ id:userID } }).then((user) => user?.toJSON() as User);
        if (!user){
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const session = await sessionsDB.findOne({ where: { userID } }).then((session) => session?.toJSON()) as Session;
        if (!session){
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (session.expires < Date.now()){
            await sessionsDB.destroy({ where:{ id:session.id } });
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const isMatch = await bcrypt.compare(token, session.token);
        if (!isMatch) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

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
            attributes:{
                exclude:['password'],
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