import { plotsDB, nodesDB } from '../models/db.index';
import { Plot } from '../models/plots.model';
import { Node } from '../models/nodes.model';
import { RequestHandler } from 'express';

export const getPlots: RequestHandler = async (req, res) => {
    try {
        const plots = await plotsDB.findAll().then((plots) => plots.map((plot) => {
            const jsonPlot:Plot = plot.toJSON();
            return jsonPlot;
        })) as Plot[];
        res.status(200).json({ plots });
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

export const getPlot: RequestHandler = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }
        const plot = await plotsDB.findOne({ where: { id: id } }).then((plot) => {
            const jsonPlot:Plot|undefined = plot?.toJSON();
            return jsonPlot;
        });
        if (!plot){
            res.status(400).json({ message: 'Plot not found' });
            return;
        }
        res.status(200).json({ plot });
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

interface CreatePlotBody {
    plot:Partial<Plot>;
}

export const createPlot: RequestHandler = async (req, res) => {
    try {
        const createPlotBody:CreatePlotBody = req.body;
        let thisID = createPlotBody.plot.id;
        if (!thisID) {
            const allPlots = await plotsDB.findAll({ attributes: ['id'] }).then((plots) => plots.map((p) => p.toJSON() as Plot));
            const existingIds = new Set(allPlots.map((p) => p.id));
            let nextId = 0;
            while (existingIds.has(nextId.toString())) {
                nextId++;
            }
            thisID = nextId.toString();
        }
        await plotsDB.create({
            ...createPlotBody.plot,
            id: thisID,
        });
        if (createPlotBody.plot.nodeID) {
            const node = await nodesDB.findOne({ where: { id: createPlotBody.plot.nodeID } }).then((node) => {
                const jsonNode:Node|undefined = node?.toJSON();
                return jsonNode;
            });
            if (node) {
                // Clear the old plot's nodeID if the node was previously assigned
                if (node.plotID) {
                    await plotsDB.update({ nodeID: null }, { where: { id: node.plotID } });
                }
                await nodesDB.update({
                    plotID: thisID,
                }, { where: { id: createPlotBody.plot.nodeID },
                });
            } else {
                res.status(400).json({ message: 'Node not found' });
                return;
            }
        }
        const plot = await plotsDB.findOne({ where: { id: thisID } }).then((plot) => plot?.toJSON()) as Plot;
        res.status(200).json({ plot });
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

interface UpdatePlotBody {
    plot?:Partial<Plot>;
}

export const updatePlot: RequestHandler = async(req, res) => {
    try {
        const updatePlotBody:UpdatePlotBody = req.body;
        const id = req.params.id;
        if (!id) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }
        if (!updatePlotBody.plot){
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }
        const plot = await plotsDB.findOne({ where: { id: id } }).then((plot) => plot?.toJSON()) as Plot;
        if (!plot){
            res.status(400).json({ message: 'Plot not found' });
            return;
        }
        plotsDB.update({
            ...updatePlotBody.plot,
        }, { where: { id: id },
        });
        const updatedPlot = await plotsDB.findOne({ where: { id: id } }).then((updatedPlot) => updatedPlot?.toJSON()) as Plot;

        res.status(200).json({ machine: updatedPlot, message: 'Plot updated' });
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

export const deletePlot: RequestHandler = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }
        const plot = await plotsDB.findOne({ where: { id: id } }).then((plot) => plot?.toJSON()) as Plot;
        if (!plot){
            res.status(400).json({ message: 'Plot not found' });
            return;
        }
        await plotsDB.destroy({ where: { id: id } });
        await nodesDB.update({
            plotID: null,
        }, { where: { id: plot.nodeID },
        });
        res.status(200).json({ message: 'Plot deleted' });
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

export const findPlotByNodeID: RequestHandler = async (req, res) => {
    try {
        const nodeID = req.params.nodeID;
        if (!nodeID) {
            res.status(400).json({ message: 'Missing required fields!' });
            return;
        }
        const plots = await plotsDB.findAll({ where: { nodeID: nodeID } }).then((plots) => plots.map((plot) => {
            const jsonPlot:Plot = plot.toJSON();
            return jsonPlot;
        })) as Plot[];

        if (!plots){
            res.status(400).json({ message: 'Plots not found' });
            return;
        }
        res.status(200).json(plots);
    } catch (e) {
        res.status(500).json({ message: e });
    }
};