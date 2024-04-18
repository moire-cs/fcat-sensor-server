import { Express } from 'express';
import * as sensorsController from '../controllers/sensors.controller';

const URL_BASE = '/api/plots';

export const usePlotRoutes = (router:Express) => {
    router.get(URL_BASE, sensorsController.getSensors);
    router.get(URL_BASE + '/:id', sensorsController.getSensor);
    router.post(URL_BASE + '/', sensorsController.createSensor);
    router.patch(URL_BASE + '/updatePlot/:id', sensorsController.updateSensor);
    router.delete(URL_BASE + '/deletePlot/:id', sensorsController.deleteSensor);
};