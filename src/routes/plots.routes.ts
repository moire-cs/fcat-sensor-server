import { Express } from 'express';
import * as plotsController from '../controllers/plots.controller';
import { authenticate } from '../controllers/users.controller';

const URL_BASE = '/api/plots';
const AUTH = authenticate;

export const usePlotRoutes = (router:Express) => {
    router.get(URL_BASE, AUTH, plotsController.getPlots);
    router.get(URL_BASE + '/:id', AUTH, plotsController.getPlot);
    router.post(URL_BASE + '/', AUTH, plotsController.createPlot);
    router.patch(URL_BASE + '/updatePlot/:id', AUTH, plotsController.updatePlot);
    router.delete(URL_BASE + '/deletePlot/:id', AUTH, plotsController.deletePlot);
    router.get(URL_BASE + '/:nodeID', AUTH, plotsController.findPlotByNodeID);
};