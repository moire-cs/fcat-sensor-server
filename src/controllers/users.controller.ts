import { usersDB, sessionsDB } from '../models/db.index';
import Express from 'express';
import { User } from '../types/User';
import bcrypt from 'bcrypt';
import { v4 as guid } from 'uuid';
import { EXPIRATION_TIME } from '../models/sessions.model';

export const login = async (req: Express.Request, res: Express.Response) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const { email, password }:{email:string,password:string} = req.body;

        const users = await usersDB.findAll({ where: { email } }).then((users) => users.map((user) => user.toJSON() as User));
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatchAny = await Promise.all(users.map(async (user) => await bcrypt.compare(password, user.password)));
        if (!isMatchAny) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        //create token
        const token = guid();
        const hashedToken = await bcrypt.hash(token, 10);
        await sessionsDB.create({ token: hashedToken, userID: users[0].id, expires: new Date(Date.now() + EXPIRATION_TIME) });

        res.json({ token, userID: users[0].id });
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
