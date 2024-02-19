import { UUIDV4 } from 'sequelize';
import { nodesDB } from '../models/db.index';
import { Node } from '../models/nodes.model';
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
    node:Partial<Node>;
}

export const createNode: RequestHandler = async (req, res) => {
    try {
        const createNodeBody:CreateNodeBody = req.body;

        await nodesDB.create({
            ...createNodeBody.node,
            id: createNodeBody.node.id ? UUIDV4() : null,
        });
        const node = await nodesDB.findOne({ where: { id: createNodeBody.node.id } }).then((node) => node?.toJSON()) as Node;
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

        nodesDB.update({
            ...updateNodeBody.node,
        }, { where: { id: id },
        });

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