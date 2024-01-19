import { nodesDB } from '../models/db.index';
import { RequestHandler } from 'express';
import createHttpError from 'http-errors';

export const getNodes: RequestHandler = async (req, res, errFunc) => {
    try {
        const nodes = await nodesDB.findAll();
        res.status(200).json(nodes);
    } catch (error) {
        errFunc(error);
    }
};

export const getNode: RequestHandler = async (req, res, errFunc) => {
    const nodeId = req.params.plotId;

    try {
        const node = await nodesDB.findByPk(nodeId);

        if (!node) {
            throw createHttpError(400, 'Node not found');
        }

        res.status(200).json(node);
    } catch (error) {
        errFunc(error);
    }
};

interface CreateNodeBody {
    id: string,
    plotID?: string,
    lastSeen?: Date,
}

export const createNode: RequestHandler<unknown, unknown, CreateNodeBody, unknown> = async (req, res, errFunc) => {
    const id = req.body.id;
    const plotID = req.body.plotID;
    const lastSeen = req.body.lastSeen;

    try {
        if (!id) {
            throw createHttpError(400, 'Node must have an id');
        }

        const newNode = await nodesDB.create({
            id: id,
            plotID: plotID,
            lastSeen: lastSeen,
        });

        res.status(201).json(newNode);
    } catch (error) {
        errFunc(error);
    }
};

interface UpdateNodeParams {
    id: string,
}

interface UpdateNodeBody {
    plotID?: string,
    lastSeen?: Date,
}

export const updateNode: RequestHandler<UpdateNodeParams, unknown, UpdateNodeBody, unknown> = async(req, res, errFunc) => {
    const id = req.params.id;
    const newPlotID = req.body.plotID;
    const newLastSeen = req.body.lastSeen;

    try {
        const node = await nodesDB.findByPk(id);

        if (!node) {
            throw createHttpError(400, 'Node not found');
        }

        node.setDataValue('plotID', newPlotID);
        node.setDataValue('lastSeen', newLastSeen);

        const updatedNode = await node.save();

        res.status(200).json(updatedNode);
    } catch (error) {
        errFunc(error);
    }
};

interface DeleteNodeParams {
    id: string;
}

export const deleteNode: RequestHandler<DeleteNodeParams, unknown, unknown, unknown> = async (req, res, errFunc) => {
    const id = req.params.id;

    try {
        const node = await nodesDB.findByPk(id);

        if (!node) {
            throw createHttpError(404, 'Node not found');
        }

        await node.destroy();

        res.status(204).send();
    } catch (error) {
        errFunc(error);
    }
};

interface FindNodeByPlotIDParams {
    plotID: string,
}

export const findNodeByPlotID: RequestHandler<FindNodeByPlotIDParams, unknown, unknown, unknown> = async (req, res, errFunc) => {
    const plotID = req.params.plotID;

    try {
        const node = await nodesDB.findAll({
            where: {
                plotID: plotID,
            },
        });

        if (!node) {
            throw createHttpError(404, 'Node not found');
        }

        res.status(200).json(node);
    } catch (error) {
        errFunc(error);
    }
};