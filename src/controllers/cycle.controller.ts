import { RequestHandler } from 'express';
import { cycleDB } from '../models/db.index';
import { CycleEntry } from '../models/cycle.model';

const DefaultCycle: CycleEntry = {
    id: '0',
    duration: 3600,//seconds
    numMessages: 5,
    syncTimeTolerance: 300,
    meshTimeTolerance: 300,
};

export const getCycle: RequestHandler = async (req, res) => {
    const cycle = await cycleDB.findOne({ where: { id: 0 } }).then((cycle) => { if (cycle) return cycle.toJSON() as CycleEntry; });
    if (cycle) {
        res.status(200).json(cycle);
    } else {
        res.status(200).json(DefaultCycle);
    }
};
type CycleUpdate = {
    duration?: number;
    numMessages?: number;
    syncTimeTolerance?: number;
    meshTimeTolerance?: number;
};
export const updateCycle: RequestHandler = async (req, res) => {
    const cycle = req.body as CycleUpdate;
    const existingCycle = await cycleDB.findOne({ where: { id: 0 } }).then((cycle) => { if (cycle) return cycle.toJSON() as CycleEntry; });
    if (existingCycle) {
        await cycleDB.update(cycle, { where: { id: 0 } });
    } else {
        await cycleDB.create({ ...DefaultCycle, ...cycle });
    }
    res.status(200).json({ message: 'Cycle updated' });
};
