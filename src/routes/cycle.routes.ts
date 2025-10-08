import { Express } from 'express';
import * as cycleController from '../controllers/cycle.controller';

const URL_BASE = '/api/cycle';
export const useCycleRoutes = (router:Express) => {
    router.get(URL_BASE, cycleController.getCycle);
    router.post(URL_BASE, cycleController.updateCycle);
};