import { messagesDB } from '../models/db.index';
import { RequestHandler } from 'express';
import createHttpError from 'http-errors';

export const getMessages: RequestHandler = async (req, res, errFunc) => {
    try {
        const messages = await messagesDB.findAll();
        res.status(200).json(messages);
    } catch (error) {
        errFunc(error);
    }
};
export const getLastMessages: RequestHandler = async (req, res, errFunc) => {
    try {
        const numMsgs = (req.params.numMsgs as unknown as number) || 10; //cast to number, or default to 10
        const messages = await messagesDB.findAll({
            limit: numMsgs,
            order: [['time', 'DESC']],
        });
        res.status(200).json(messages);
    } catch (error) {
        errFunc(error);
    }
};

export const getMessage: RequestHandler = async (req, res, errFunc) => {
    const id = req.params.id;

    try {
        const message = await messagesDB.findByPk(id);

        if (!message) {
            throw createHttpError(400, 'Message not found');
        }

        res.status(200).json(message);
    } catch (error) {
        errFunc(error);
    }
};

interface CreateMessageBody {
    id: string,
    nodeID?: string,
    plotID?: string,
    time?: Date,
    battery?: string,
    soilConductivity?: number,
    humidity?: number,
    temperature?: number,
    sunlight?: number,
}

export const createMessage: RequestHandler<unknown, unknown, CreateMessageBody, unknown> = async (req, res, errFunc) => {
    const id = req.body.id;
    const nodeID = req.body.nodeID;
    const plotID = req.body.plotID;
    const time = req.body.time;
    const battery = req.body.battery;
    const soilConductivity = req.body.soilConductivity;
    const humidity = req.body.humidity;
    const temperature = req.body.temperature;
    const sunlight = req.body.sunlight;

    try {
        if (!id) {
            throw createHttpError(400, 'Message must have an id');
        }

        const newMessage = await messagesDB.create({
            id: id,
            nodeID: nodeID,
            plotID: plotID,
            time: time,
            battery: battery,
            soilConductivity: soilConductivity,
            humidity: humidity,
            temperature: temperature,
            sunlight: sunlight,

        });

        res.status(201).json(newMessage);
    } catch (error) {
        errFunc(error);
    }
};

interface UpdateMessageParams {
    id: string,
}

interface UpdateMessageBody {
    id: string,
    nodeID?: string,
    plotID?: string,
    time?: Date,
    battery?: string,
    soilConductivity?: number,
    humidity?: number,
    temperature?: number,
    sunlight?: number,
}

export const updateMessage: RequestHandler<UpdateMessageParams, unknown, UpdateMessageBody, unknown> = async (req, res, errFunc) => {
    const id = req.body.id;
    const newNodeID = req.body.nodeID;
    const newPlotID = req.body.plotID;
    const newTime = req.body.time;
    const newBattery = req.body.battery;
    const newSoilConductivity = req.body.soilConductivity;
    const newHumidity = req.body.humidity;
    const newTemperature = req.body.temperature;
    const newSunlight = req.body.sunlight;

    try {
        const message = await messagesDB.findByPk(id);

        if (!message) {
            throw createHttpError(400, 'Message not found');
        }

        message.setDataValue('nodeID', newNodeID);
        message.setDataValue('plotID', newPlotID);
        message.setDataValue('time', newTime);
        message.setDataValue('battery', newBattery);
        message.setDataValue('soilConductivity', newSoilConductivity);
        message.setDataValue('humidity', newHumidity);
        message.setDataValue('temperature', newTemperature);
        message.setDataValue('sunlight', newSunlight);

        const updatedMessage = await message.save();

        res.status(200).json(updatedMessage);
    } catch (error) {
        errFunc(error);
    }
};

interface DeleteMessageParams {
    id: string;
}

export const deleteMessage: RequestHandler<DeleteMessageParams, unknown, unknown, unknown> = async (req, res, errFunc) => {
    const id = req.params.id;

    try {
        const message = await messagesDB.findByPk(id);

        if (!message) {
            throw createHttpError(404, 'Message not found');
        }

        await message.destroy();

        res.status(204).send();
    } catch (error) {
        errFunc(error);
    }
};

interface FindMessagesByNodeIDParams {
    nodeID: string,
}

export const findMessagesByNodeID: RequestHandler<FindMessagesByNodeIDParams, unknown, unknown, unknown> = async (req, res, errFunc) => {
    const nodeID = req.params.nodeID;

    try {
        const message = await messagesDB.findAll({
            where: {
                nodeID: nodeID,
            },
        });

        if (!message) {
            throw createHttpError(404, 'Message not found');
        }

        res.status(200).json(message);
    } catch (error) {
        errFunc(error);
    }
};

interface FindMessagesByPlotIDParams {
    plotID: string,
}

export const findMessagesByPlotID: RequestHandler<FindMessagesByPlotIDParams, unknown, unknown, unknown> = async (req, res, errFunc) => {
    const plotID = req.params.plotID;

    try {
        const message = await messagesDB.findAll({
            where: {
                plotID: plotID,
            },
        });

        if (!message) {
            throw createHttpError(404, 'Message not found');
        }

        res.status(200).json(message);
    } catch (error) {
        errFunc(error);
    }
};