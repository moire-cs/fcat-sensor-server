import { UUIDV4 } from 'sequelize';
import { messagesDB } from '../models/db.index';
import { Message } from '../models/messages.model';
import { RequestHandler } from 'express';

export const getMessages: RequestHandler = async (req, res) => {
    try {
        const messages = await messagesDB.findAll().then((messages) => messages.map((message) => {
            const jsonMessage:Message = message.toJSON();
            return jsonMessage;
        })) as Message[];
        res.status(200).json({ messages });
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

export const getLastMessages: RequestHandler = async (req, res) => {
    try {
        const numMsgs = (req.params.numMsgs as unknown as number) || 10; //cast to number, or default to 10
        const messages = await messagesDB.findAll({
            limit: numMsgs,
            order: [['time', 'DESC']],
        });
        res.status(200).json(messages);
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

export const getMessage: RequestHandler = async (req, res) => {
    try {
        const messageID = req.params.id;
        if (!messageID) {
            res.status(400).json({ message: 'Missing required fields!' });
            return;
        }

        const message = await messagesDB.findOne({ where: { id: messageID } }).then((message) => {
            const jsonMachine:Message|undefined = message?.toJSON();
            return jsonMachine;
        });

        if (!message) {
            res.status(400).json({ message: 'Message not found!' });
        }

        res.status(200).json(message);
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

interface CreateMessageBody {
    message:Partial<Message>
}

export const createMessage: RequestHandler = async (req, res) => {
    try {
        const createMessageBody:CreateMessageBody = req.body;

        await messagesDB.create({
            ...createMessageBody.message,
            id: createMessageBody.message.id ? UUIDV4() : null,
        });

        const message = await messagesDB.findOne({ where: { name: createMessageBody.message.id } }).then((message) => message?.toJSON()) as Message;

        res.status(201).json({ message });
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

export const findMessagesByNodeID: RequestHandler = async (req, res) => {
    try {
        const nodeID = req.params.nodeID;
        if (!nodeID) {
            res.status(400).json({ message: 'Missing required fields!' });
        }
        const message = await messagesDB.findAll({ where: { nodeID: nodeID } }).then((messages) => messages.map((message) => {
            const jsonMessage:Message = message.toJSON();
            return jsonMessage;
        })) as Message[];

        if (!message){
            res.status(400).json({ message: 'Message not found' });
            return;
        }
        res.status(200).json(message);
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

export const findMessagesByPlotID: RequestHandler = async (req, res) => {
    try {
        const plotID = req.params.plotID;
        if (!plotID) {
            res.status(400).json({ message: 'Missing required fields!' });
        }
        const message = await messagesDB.findAll({ where: { plotID: plotID } }).then((messages) => messages.map((message) => {
            const jsonMessage:Message = message.toJSON();
            return jsonMessage;
        })) as Message[];

        if (!message){
            res.status(400).json({ message: 'Message not found' });
            return;
        }
        res.status(200).json(message);
    } catch (e) {
        res.status(500).json({ message: e });
    }
};