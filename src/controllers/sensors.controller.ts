import { sensorsDB } from '../models/db.index';
import { Sensor } from '../models/sensors.model';
import { RequestHandler } from 'express';

export const getSensors: RequestHandler = async (req, res) => {
    try {
        const sensors = await sensorsDB.findAll().then((sensors) => sensors.map((sensors) => {
            const jsonSensors:Sensor = sensors.toJSON();
            return jsonSensors;
        })) as Sensor[];
        res.status(200).json({ sensors });
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

export const getSensor: RequestHandler = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }
        const sensor = await sensorsDB.findOne({ where: { id: id } }).then((sensor) => {
            const jsonSensor:Sensor|undefined = sensor?.toJSON();
            return jsonSensor;
        });
        if (!sensor){
            res.status(400).json({ message: 'Sensor not found' });
            return;
        }
        res.status(200).json({ sensor });
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

interface CreateSensorBody extends Sensor {
        id: number;
        name: string;
        description?: string;
        length: number;
        transformEq: string;
        typicalRange?:[number,number];
}

export const createSensor: RequestHandler = async (req, res) => {
    try {
        const createSensorBody:CreateSensorBody = req.body;
        if (createSensorBody.id && createSensorBody.name && createSensorBody.length && createSensorBody.transformEq) {
            await sensorsDB.create({
                ...createSensorBody,
            });
            const sensor = await sensorsDB.findOne({ where: { id: createSensorBody.id } }).then((sensor) => sensor?.toJSON()) as Sensor;
            res.status(200).json({ sensor });
            return;
        } else {
            res.status(400).json({ message: 'Sensor missing required fields!' });
            return;
        }
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

interface UpdateSensorBody {
    sensor?:Partial<Sensor>;
}

export const updateSensor: RequestHandler = async(req, res) => {
    try {
        const updateSensorBody:UpdateSensorBody = req.body;
        const id = req.params.id;
        if (!id) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }
        if (!updateSensorBody.sensor){
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }
        const sensor = await sensorsDB.findOne({ where: { id: id } }).then((sensor) => sensor?.toJSON()) as Sensor;
        if (!sensor){
            res.status(400).json({ message: 'Sensor not found' });
            return;
        }
        sensorsDB.update({
            ...updateSensorBody.sensor,
        }, { where: { id: id },
        });
        const updatedSensor = await sensorsDB.findOne({ where: { id: id } }).then((sensor) => sensor?.toJSON()) as Sensor;

        res.status(200).json({ machine: updatedSensor, message: 'Sensor updated' });
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

export const deleteSensor: RequestHandler = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }
        const sensor = await sensorsDB.findOne({ where: { id: id } }).then((sensor) => sensor?.toJSON()) as Sensor;
        if (!sensor){
            res.status(400).json({ message: 'Sensor not found' });
            return;
        }
        await sensorsDB.destroy({ where: { id: id } });
        res.status(200).json({ message: 'Sensor deleted' });
    } catch (e) {
        res.status(500).json({ message: e });
    }
};