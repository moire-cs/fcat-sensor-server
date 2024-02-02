import { logDB } from '../models/db.index';
import { Log } from '../models/log.model';
import { RequestHandler } from 'express';

export const getLogs: RequestHandler = async (req, res) => {
    try {
        const logs = await logDB.findAll().then((logs) => logs.map((logs) => {
            const jsonLog:Log = logs.toJSON();
            return jsonLog;
        })) as Log[];

        res.status(200).json({ logs });
    } catch (error) {
        res.status(500).json({ message:error });
    }
};

export const getLog: RequestHandler = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }
        const log = await logDB.findOne({ where: { id: id } }).then((log) => {
            const jsonLog:Log|undefined = log?.toJSON();
            return jsonLog;
        });
        if (!log) {
            res.status(400).json({ message: 'Log not found' });
            return;
        }
        res.status(200).json({ log });
    } catch (error) {
        res.status(500).json({ message:error });
    }
};

interface CreateLogBody {
    log: Partial<Log>;
}

export const createLog: RequestHandler = async (req, res) => {
    try {
        const id = req.headers.id as string;

        const createLogBody:CreateLogBody = req.body;

        if (!id) {
            res.status(400).json({ message: 'Missing Log ID' });
            return;
        }

        await logDB.create({
            ...createLogBody.log,
            time: Date(),
        });

        const log = await logDB.findOne({ where: { id: id } }).then((log) => log?.toJSON()) as Log;

        res.status(200).json({ log });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};