import { Express } from 'express';
import * as nodesController from '../controllers/nodes.controller';

const URL_BASE = '/api/nodes';

export const useNodeRoutes = (router:Express) => {
    router.get(URL_BASE, nodesController.getNodes);
    router.get(URL_BASE + '/:nodeId', nodesController.getNode);
    router.post(URL_BASE + '/', nodesController.createNode);
    router.patch(URL_BASE + '/updateNode/:id', nodesController.updateNode);
    router.delete(URL_BASE + '/deleteNode/:id', nodesController.deleteNode);
    router.get(URL_BASE + '/:plotID', nodesController.findNodeByPlotID);
};