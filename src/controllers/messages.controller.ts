import { UUIDV4 } from 'sequelize';
import { messagesDB } from '../models/db.index';
import { Message, Measurement } from '../models/messages.model';
import { RequestHandler } from 'express';

export const getMessages: RequestHandler = async (req, res) => {
    try {
        const messages = await messagesDB.findAll({ where: { type: 'MESSAGE' } }).then((messages) => messages.map((message) => {
            const jsonMessage:Message = message.toJSON();
            return jsonMessage;
        })) as Message[];
        res.status(200).json({ messages });
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

export const getMeasurements: RequestHandler = async (req, res) => {
    try {
        const measurements = await messagesDB.findAll({ where: { type: 'MEASUREMENT' } }).then((measurements) => measurements.map((measurements) => {
            const jsonMeasurement:Measurement = measurements.toJSON();
            return jsonMeasurement;
        })) as Measurement[];
        res.status(200).json({ measurements });
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

export const getLastMessages: RequestHandler = async (req, res) => {
    try {
        const numMsgs = (req.params.numMsgs as unknown as number) || 10; //cast to number, or default to 10
        const messages = await messagesDB.findAll({
            where: { type: 'MESSAGE' },
            limit: numMsgs,
            order: [['time', 'DESC']],
        }).then((messages) => messages.map((messages) => {
            const jsonMessages:Message = messages.toJSON();
            return jsonMessages;
        })) as Message[];
        res.status(200).json(messages);
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

export const getLastMeasurements: RequestHandler = async (req, res) => {
    try {
        const numMsgs = (req.params.numMsgs as unknown as number) || 10; //cast to number, or default to 10
        const measurements = await messagesDB.findAll({
            where: { type: 'MEASUREMENT' },
            limit: numMsgs,
            order: [['time', 'DESC']],
        }).then((measurements) => measurements.map((measurements) => {
            const jsonMeasurements:Measurement = measurements.toJSON();
            return jsonMeasurements;
        })) as Measurement[];
        res.status(200).json(measurements);
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

        const message = await messagesDB.findOne({ where: { id: messageID, type: 'MESSAGE' } }).then((message) => {
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

export const getMeasurementsByID: RequestHandler = async (req, res) => {
    try {
        const measurementID = req.params.id;
        if (!measurementID) {
            res.status(400).json({ message: 'Missing required fields!' });
            return;
        }

        const measurements = await messagesDB.findAll({ where: { id: measurementID, type: 'MEASUREMENT' } }).then((measurements) => measurements.map((measurements) => {
            const jsonMeasurement:Measurement = measurements.toJSON();
            return jsonMeasurement;
        })) as Measurement[];

        if (!measurements) {
            res.status(400).json({ message: 'Measurements not found!' });
        }

        res.status(200).json(measurements);
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

        const message = await messagesDB.findOne({ where: { name: createMessageBody.message.id, type: 'MESSAGE' } }).then((message) => message?.toJSON()) as Message;

        res.status(201).json({ message });
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

interface CreateMeasurementBody {
    measurement:Partial<Measurement>
}

export const createMeasurement: RequestHandler = async (req, res) => {
    try {
        const createMeasurementBody:CreateMeasurementBody = req.body;

        await messagesDB.create({
            ...createMeasurementBody.measurement,
            id: createMeasurementBody.measurement.id ? UUIDV4() : null,
        });

        const measurement = await messagesDB.findOne({ where: { name: createMeasurementBody.measurement.id, type: 'MEASUREMENT' } }).then((measurement) => measurement?.toJSON()) as Measurement;

        res.status(201).json({ measurement });
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
        const message = await messagesDB.findAll({ where: { nodeID: nodeID, type: 'MESSAGE' } }).then((messages) => messages.map((message) => {
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

export const findMeasurementsByNodeID: RequestHandler = async (req, res) => {
    try {
        const nodeID = req.params.nodeID;
        if (!nodeID) {
            res.status(400).json({ message: 'Missing required fields!' });
        }
        const measurement = await messagesDB.findAll({ where: { nodeID: nodeID, type: 'MEASUREMENT' } }).then((measurement) => measurement.map((measurement) => {
            const jsonMeasurement:Measurement = measurement.toJSON();
            return jsonMeasurement;
        })) as Measurement[];

        if (!measurement){
            res.status(400).json({ message: 'Measurement not found' });
            return;
        }
        res.status(200).json(measurement);
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
        const message = await messagesDB.findAll({ where: { plotID: plotID, type: 'MESSAGE' } }).then((messages) => messages.map((message) => {
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

export const findMeasurementsByPlotID: RequestHandler = async (req, res) => {
    try {
        const plotID = req.params.plotID;
        if (!plotID) {
            res.status(400).json({ message: 'Missing required fields!' });
        }
        const measurement = await messagesDB.findAll({ where: { plotID: plotID, type: 'MEASUREMENT' } }).then((measurement) => measurement.map((measurement) => {
            const jsonMeasurement:Measurement = measurement.toJSON();
            return jsonMeasurement;
        })) as Measurement[];

        if (!measurement){
            res.status(400).json({ message: 'Measurement not found' });
            return;
        }
        res.status(200).json(measurement);
    } catch (e) {
        res.status(500).json({ message: e });
    }
};