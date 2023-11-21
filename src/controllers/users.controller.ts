import { usersDB, sessionsDB } from '../models/db.index';
import Express from 'express';
import { User } from '../types/User';
import bcrypt from 'bcrypt';
import { v4 as guid } from 'uuid';

export const login = async (req: Express.Request, res: Express.Response) => {
    try {
        const { username, password }:{username:string,password:string} = req.body;
        const user = await usersDB.findOne({ where: { username } }).then((user) => user?.toJSON()) as User;
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        //create token
        const token = guid();
        const hashedToken = await bcrypt.hash(token, 10);
        await sessionsDB.create({ token: hashedToken, userId: user.id });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

export const logout = async (req: Express.Request, res: Express.Response) => {
    try {
        const token = req.body.token;
        await sessionsDB.destroy({ where: { token } });
        res.json({ message: 'User logged out' });
    } catch (error) {
        res.status(500).json({ message: error });
    }

};

export const register = async (req: Express.Request, res: Express.Response) => {
    try {
        const { username, password, email }:{username:string,password:string,email:string} = req.body;
        const user = await usersDB.findOne({ where: { username } });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await usersDB.create({ username, password: hashedPassword, email, preferences:'{}' });
        res.status(201).json({ message:'User created' });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

export const authenticate = async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    try {
        const token = req.headers.token as string;
        const userID = req.headers.userid as string;
        if (!token || !userID) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const session = await sessionsDB.findOne({ where: { userID } }).then((session) => session?.toJSON());
        const isMatch = await bcrypt.compare(token, session?.token as string);
        if (!isMatch) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: error });
    }
};
