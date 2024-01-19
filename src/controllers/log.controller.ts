import { logDB } from '../models/db.index';
import { RequestHandler } from 'express';
import createHttpError from 'http-errors';

export const getLogs: RequestHandler = async (req, res, errFunc) => {
    try {
        const logs = await logDB.findAll();
        res.status(200).json(logs);
    } catch (error) {
        errFunc(error);
    }
};

export const getLog: RequestHandler = async (req, res, errFunc) => {
    const id = req.params.id;

    try {
        const log = await logDB.findByPk(id);

        if (!log) {
            throw createHttpError(400, 'Log not found');
        }

        res.status(200).json(log);
    } catch (error) {
        errFunc(error);
    }
};

interface CreateLogBody {
    id: string,
    time: Date,
    message: string,
    type: string,
    messageID?: string,
    nodeID?: string,
    plotID?: string,
    userID?: string,
}

export const createLog: RequestHandler<unknown, unknown, CreateLogBody, unknown> = async (req, res, errFunc) => {
    const id = req.body.id;
    const time = req.body.time;
    const message = req.body.message;
    const type = req.body.type;
    const messageID = req.body.messageID;
    const nodeID = req.body.nodeID;
    const plotID = req.body.plotID;
    const userID = req.body.userID;

    try {
        if (!id) {
            throw createHttpError(400, 'Log must have an id');
        }

        const newLog = await logDB.create({
            id: id,
            time: time,
            message: message,
            type: type,
            messageID: messageID,
            nodeID: nodeID,
            plotID: plotID,
            userID: userID,
        });

        res.status(201).json(newLog);
    } catch (error) {
        errFunc(error);
    }
};

interface UpdateLogParams {
    id: string,
}

interface UpdateLogBody {
    id: string,
    time: Date,
    message: string,
    type: string,
    messageID?: string,
    nodeID?: string,
    plotID?: string,
    userID?: string,
}

export const updateLog: RequestHandler<UpdateLogParams, unknown, UpdateLogBody, unknown> = async (req, res, errFunc) => {
    const id = req.body.id;
    const newTime = req.body.time;
    const newMessage = req.body.message;
    const newType = req.body.type;
    const newMessageID = req.body.messageID;
    const newNodeID = req.body.nodeID;
    const newPlotID = req.body.plotID;
    const newUserID = req.body.userID;

    try {
        const log = await logDB.findByPk(id);

        if (!log) {
            throw createHttpError(400, 'Log not found');
        }

        log.setDataValue('time', newTime);
        log.setDataValue('message', newMessage);
        log.setDataValue('type', newType);
        log.setDataValue('messageID', newMessageID);
        log.setDataValue('nodeID', newNodeID);
        log.setDataValue('plotID', newPlotID);
        log.setDataValue('userID', newUserID);

        const updatedLog = await log.save();

        res.status(200).json(updatedLog);
    } catch (error) {
        errFunc(error);
    }
};

interface DeleteLogParams {
    id: string;
}

export const deleteLog: RequestHandler<DeleteLogParams, unknown, unknown, unknown> = async (req, res, errFunc) => {
    const id = req.params.id;

    try {
        const log = await logDB.findByPk(id);

        if (!log) {
            throw createHttpError(404, 'Log not found');
        }

        await log.destroy();

        res.status(204).send();
    } catch (error) {
        errFunc(error);
    }
};
