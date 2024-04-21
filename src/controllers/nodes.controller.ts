import { UUIDV4 } from 'sequelize';
import { nodesDB, plotsDB } from '../models/db.index';
import { Node } from '../models/nodes.model';
import { Plot } from '../models/plots.model';
import { RequestHandler } from 'express';

export const getNodes: RequestHandler = async (req, res) => {
    try {
        const nodes = await nodesDB.findAll().then((nodes) => nodes.map((node) => {
            const jsonNode:Node = node.toJSON();
            return jsonNode;
        })) as Node[];
        res.status(200).json(nodes);
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

export const getNode: RequestHandler = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }
        const node = await nodesDB.findOne({ where: { id: id } }).then((node) => {
            const jsonNode:Node|undefined = node?.toJSON();
            return jsonNode;
        });
        if (!node){
            res.status(400).json({ message: 'Node not found' });
            return;
        }
        res.status(200).json(node);
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

interface CreateNodeBody {
    node: Omit<Partial<Node>, 'id'>;
}

export const createNode: RequestHandler = async (req, res) => {
    try {
        const createNodeBody:CreateNodeBody = req.body;
        const nodeID = UUIDV4();
        await nodesDB.create({
            ...createNodeBody.node,
            id: nodeID,
        });
        if (createNodeBody.node.plotID) {
            const plot = await plotsDB.findOne({ where: { id: createNodeBody.node.plotID } }).then((plot) => {
                const jsonPlot:Plot|undefined = plot?.toJSON();
                return jsonPlot;
            });
            if (plot) {
                await plotsDB.update({
                    nodeID: nodeID,
                }, { where: { id: createNodeBody.node.plotID },
                });
            } else {
                res.status(400).json({ message: 'Plot not found' });
                return;
            }
        }
        const node = await nodesDB.findOne({ where: { id: nodeID } }).then((node) => node?.toJSON()) as Node;
        res.status(201).json(node);
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

interface UpdateNodeBody {
    node?: Partial<Node>,
}

export const updateNode: RequestHandler = async(req, res) => {
    try {
        const updateNodeBody:UpdateNodeBody = req.body;
        const id = req.params.id;
        if (!id || !updateNodeBody.node) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }
        const node = await nodesDB.findOne({ where: { id: id } }).then((node) => node?.toJSON()) as Node;
        if (!node){
            res.status(400).json({ message: 'Node not found' });
            return;
        }
        await nodesDB.update({
            ...updateNodeBody.node,
        }, { where: { id: id },
        });
        if (updateNodeBody.node.plotID) {
            const plot = await plotsDB.findOne({ where: { id: updateNodeBody.node.plotID } }).then((plot) => {
                const jsonPlot:Plot|undefined = plot?.toJSON();
                return jsonPlot;
            });
            if (plot) {
                await plotsDB.update({
                    nodeID: id,
                }, { where: { id: updateNodeBody.node.plotID },
                });
            } else {
                res.status(400).json({ message: 'Plot not found' });
                return;
            }
        }
        const updatedNode = await nodesDB.findOne({ where: { id: id } }).then((node) => node?.toJSON()) as Node;
        res.status(200).json({ node: updatedNode, message: 'Node updated' });
    } catch (e) {
        res.status(500).json({ message: e });    }
};

export const deleteNode: RequestHandler = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }
        const node = await nodesDB.findOne({ where: { id: id } }).then((node) => node?.toJSON()) as Node;
        if (!node){
            res.status(400).json({ message: 'Node not found' });
            return;
        }
        await nodesDB.destroy({ where: { id: id } });
        await plotsDB.update({
            nodeID: null,
        }, { where: { id: node.plotID },
        });
        res.status(200).json({ message: 'Node deleted' });
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

export const findNodeByPlotID: RequestHandler = async (req, res) => {
    try {
        const plotID = req.params.plotID;
        if (!plotID) {
            res.status(400).json({ message: 'Missing required fields!' });
        }
        const node = await nodesDB.findAll({ where: { plotID: plotID } }).then((nodes) => nodes.map((node) => {
            const jsonNode:Node = node.toJSON();
            return jsonNode;
        })) as Node[];
        if (!node){
            res.status(400).json({ message: 'Node not found' });
            return;
        }
        res.status(200).json(node);
    } catch (e) {
        res.status(500).json({ message: e });
    }
};