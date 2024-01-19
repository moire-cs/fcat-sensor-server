import { plotsDB } from '../models/db.index';
import { RequestHandler } from 'express';
import createHttpError from 'http-errors';

export const getPlots: RequestHandler = async (req, res, errFunc) => {
    try {
        const plots = await plotsDB.findAll();
        res.status(200).json(plots);
    } catch (error) {
        errFunc(error);
    }
};

export const getPlot: RequestHandler = async (req, res, errFunc) => {
    const id = req.params.id;

    try {
        const plot = await plotsDB.findByPk(id);

        if (!plot) {
            throw createHttpError(400, 'Plot not found');
        }

        res.status(200).json(plot);
    } catch (error) {
        errFunc(error);
    }
};

interface CreatePlotBody {
    id: string,
    nodeID?: string,
    latitude: number,
    longitude: number,
    description?: string,
}

export const createPlot: RequestHandler<unknown, unknown, CreatePlotBody, unknown> = async (req, res, errFunc) => {
    const id = req.body.id;
    const nodeID = req.body.nodeID;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const description = req.body.description;

    try {
        if (!id) {
            throw createHttpError(400, 'Plot must have an id');
        }

        if (!latitude) {
            throw createHttpError(400, 'Plot must have an latitude');
        }

        if (!longitude) {
            throw createHttpError(400, 'Plot must have an longitude');
        }

        const newPlot = await plotsDB.create({
            id: id,
            nodeID: nodeID,
            latitude: latitude,
            longitude: longitude,
            description: description,
        });

        res.status(201).json(newPlot);
    } catch (error) {
        errFunc(error);
    }
};

interface UpdatePlotParams {
    id: string,
}

interface UpdatePlotBody {
    id: string,
    nodeID?: string,
    latitude?: number,
    longitude?: number,
    description?: string,
}

export const updatePlot: RequestHandler<UpdatePlotParams, unknown, UpdatePlotBody, unknown> = async(req, res, errFunc) => {
    const id = req.body.id;
    const newNodeID = req.body.nodeID;
    const newLatitude = req.body.latitude;
    const newLongitude = req.body.longitude;
    const newDescription = req.body.description;

    try {
        const plot = await plotsDB.findByPk(id);

        if (!plot) {
            throw createHttpError(400, 'Plot not found');
        }

        if (!newLatitude) {
            throw createHttpError(400, 'Plot must have a latitude');
        }

        if (!newLongitude) {
            throw createHttpError(400, 'Plot must have a longitude');
        }

        plot.setDataValue('nodeID', newNodeID);
        plot.setDataValue('latitude', newLatitude);
        plot.setDataValue('longitude', newLongitude);
        plot.setDataValue('description', newDescription);

        const updatedPlot = await plot.save();

        res.status(200).json(updatedPlot);
    } catch (error) {
        errFunc(error);
    }
};

interface DeletePlotParams {
    id: string;
}

export const deletePlot: RequestHandler<DeletePlotParams, unknown, unknown, unknown> = async (req, res, errFunc) => {
    const id = req.params.id;

    try {
        const plot = await plotsDB.findByPk(id);

        if (!plot) {
            throw createHttpError(404, 'Plot not found');
        }

        await plot.destroy();

        res.status(204).send();
    } catch (error) {
        errFunc(error);
    }
};

interface FindPlotByNodeIDParams {
    nodeID: string;
}

export const findPlotByNodeID: RequestHandler<FindPlotByNodeIDParams, unknown, unknown, unknown> = async (req, res, errFunc) => {
    const nodeID = req.params.nodeID;

    try {
        const plot = await plotsDB.findAll({
            where: {
                nodeID: nodeID,
            },
        });

        if (!plot) {
            throw createHttpError(404, 'Plot not found');
        }

        res.status(200).json(plot);
    } catch (error) {
        errFunc(error);
    }
};