import { UUIDV4 } from 'sequelize';
import { plotsDB } from '../models/db.index';
import { Plot } from '../models/plots.model';
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
        const thisID = UUIDV4();
        await plotsDB.create({
            ...createPlotBody.plot,
            id: createPlotBody.plot.id ? thisID : null,
        });
        const plot = await plotsDB.findOne({ where: { name: thisID } }).then((plot) => plot?.toJSON()) as Plot;
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
        const updatedPlot = await plotsDB.findOne({ where: { id: id } }).then((plot) => plot?.toJSON()) as Plot;

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
        }
        const plot = await plotsDB.findAll({ where: { nodeID: nodeID } }).then((plots) => plots.map((plot) => {
            const jsonPlot:Plot = plot.toJSON();
            return jsonPlot;
        })) as Plot[];

        if (!plot){
            res.status(400).json({ message: 'Plot not found' });
            return;
        }
        res.status(200).json(plot);
    } catch (e) {
        res.status(500).json({ message: e });
    }
};