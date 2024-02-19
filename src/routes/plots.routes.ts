import { Express } from 'express';
import * as plotsController from '../controllers/plots.controller';

const URL_BASE = '/api/plots';

export const usePlotRoutes = (router:Express) => {
    router.get(URL_BASE, plotsController.getPlots);
    router.get(URL_BASE + '/:id', plotsController.getPlot);
    router.post(URL_BASE + '/', plotsController.createPlot);
    router.patch(URL_BASE + '/updatePlot/:id', plotsController.updatePlot);
    router.delete(URL_BASE + '/deletePlot/:id', plotsController.deletePlot);
    router.get(URL_BASE + '/:nodeID', plotsController.findPlotByNodeID);
};