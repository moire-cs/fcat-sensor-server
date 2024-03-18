import { usersDB, sessionsDB } from '../models/db.index';
import Express from 'express';
import bcrypt from 'bcrypt';
import { v4 as guid } from 'uuid';
import { EXPIRATION_TIME, Session } from '../models/sessions.model';
import { RequestHandler } from 'express';
import { User, UserType } from '../models/users.model';

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
        const user = await usersDB.findOne({ where: { email }, attributes:{ exclude:['password'] } }).then((user) => user?.toJSON() as Omit<User,'password'>);
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

        const user = await usersDB.findOne({ where: { email }, attributes:{ exclude:['password'] } });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser:Omit<User,'id'> = { name, password: hashedPassword, email, preferences:null, type: 'user' };
        await usersDB.create(newUser);
        res.status(201).json({ message:'User created' });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};
export const authenticate = async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    try {
        const token = req.headers.token as string;
        const userID = req.headers.userid as string;
        const userType = req.headers.usertype as UserType;
        if (!token || !userID || !userType) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await usersDB.findOne({ where:{ id:userID,type:userType }, attributes:{ exclude:['password'] } }).then((user) => user?.toJSON() as Omit<User,'password'>);
        if (!user){
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const session = await sessionsDB.findOne({ where: { userID } }).then((session) => session?.toJSON()) as Session;
        if (!session){
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (session.expires.getTime() < Date.now()){
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

export const getUsers: RequestHandler = async (req, res) => {
    try {
        const users = await usersDB.findAll({ attributes:{ exclude:['password'] } } ).then((users) => users.map((user) => {
            const jsonUser:User = user.toJSON();
            return jsonUser;
        })) as Omit<User,'password'>[];
        res.status(200).json({ users });
    } catch (e) {
        res.status(500).json({ message: e });    }
};

export const getUser: RequestHandler = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }
        const user = await usersDB.findOne({ where: { id: id }, attributes:{ exclude:['password'] } }).then((user) => {
            const jsonUser:User|undefined = user?.toJSON();
            return jsonUser;
        }) as Omit<User,'password'>;
        if (!user){
            res.status(400).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ user });
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

interface UpdateUserBody {
    user?:Partial<User>;
}

export const updateUser: RequestHandler = async(req, res) => {
    try {
        const updateUserBody:UpdateUserBody = req.body;
        const id = req.params.id;
        if (!id) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }
        if (!updateUserBody.user) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }
        const user = await usersDB.findOne({ where: { id: id }, attributes:{ exclude:['password'] } }).then((user) => user?.toJSON()) as Omit<User,'password'>;
        if (!user) {
            res.status(400).json({ message: 'User not found' });
            return;
        }
        usersDB.update({
            ...updateUserBody.user,
        }, { where: { id:id },
        });
        const updatedUser = await usersDB.findOne({ where:{ id:id }, attributes:{ exclude:['password'] } }).then((updatedUser) => updatedUser?.toJSON()) as Omit<User,'password'>;

        res.status(200).json(updatedUser);
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

export const deleteUser: RequestHandler = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }
        const user = await usersDB.findOne({ where: { id: id }, attributes:{ exclude:['password'] } }).then((user) => user?.toJSON()) as Omit<User,'password'>;
        if (!user){
            res.status(400).json({ message: 'User not found' });
            return;
        }
        await usersDB.destroy({ where: { id: id } });
        res.status(200).json({ message: 'User deleted' });
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

export const getUserByEmail: RequestHandler = async (req, res) => {
    try {
        const email = req.params.email;
        if (!email) {
            res.status(400).json({ message: 'Missing required fields!' });
            return;
        }

        const users = await usersDB.findAll({ where: { email: email }, attributes:{ exclude:['password'] } }).then((users) => users.map((users) => {
            const jsonUsers:User = users.toJSON();
            return jsonUsers;
        })) as Omit<User,'password'>[];

        if (!users){
            res.status(400).json({ message: 'Users not found' });
            return;
        }
        res.status(200).json(users);
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

export const getUserByName: RequestHandler = async (req, res) => {
    try {
        const name = req.params.name;
        if (!name) {
            res.status(400).json({ message: 'Missing required fields!' });
            return;
        }
        const users = await usersDB.findAll({ where: { name: name }, attributes:{ exclude:['password'] } }).then((users) => users.map((users) => {
            const jsonUsers:User = users.toJSON();
            return jsonUsers;
        })) as Omit<User,'password'>[];

        if (!users){
            res.status(400).json({ message: 'Users not found' });
            return;
        }
        res.status(200).json(users);
    } catch (e) {
        res.status(500).json({ message: e });
    }
};