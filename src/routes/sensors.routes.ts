import { Express } from 'express';
import * as sensorsController from '../controllers/sensors.controller';
import { authenticate } from '../controllers/users.controller';

const URL_BASE = '/api/plots';
const AUTH = authenticate;

export const usePlotRoutes = (router:Express) => {
    router.get(URL_BASE, AUTH, sensorsController.getSensors);
    router.get(URL_BASE + '/:id', AUTH, sensorsController.getSensor);
    router.post(URL_BASE + '/', AUTH, sensorsController.createSensor);
    router.patch(URL_BASE + '/updatePlot/:id', AUTH, sensorsController.updateSensor);
    router.delete(URL_BASE + '/deletePlot/:id', AUTH, sensorsController.deleteSensor);
};