import { Express } from 'express';
import * as nodesController from '../controllers/nodes.controller';
import { authenticate } from '../controllers/users.controller';

const URL_BASE = '/api/nodes';
const AUTH = authenticate;

export const useNodeRoutes = (router:Express) => {
    router.get(URL_BASE, AUTH, nodesController.getNodes);
    router.get(URL_BASE + '/:nodeId', AUTH, nodesController.getNode);
    router.post(URL_BASE + '/', AUTH, nodesController.createNode);
    router.patch(URL_BASE + '/updateNode/:id', AUTH, nodesController.updateNode);
    router.delete(URL_BASE + '/deleteNode/:id', AUTH, nodesController.deleteNode);
    router.get(URL_BASE + '/:plotID', AUTH, nodesController.findNodeByPlotID);
};