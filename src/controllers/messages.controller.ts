import { messagesDB, nodesDB, plotsDB, sensorsDB } from '../models/db.index';
import { Message, Measurement } from '../models/messages.model';
import { RequestHandler } from 'express';
import { serialConfig } from '../config/serial.config';
import { Node } from '../models/nodes.model';
import { Sensor } from '../models/sensors.model';
import { v4 } from 'uuid';
import { parser } from 'mathjs';

export const getMessages: RequestHandler = async (req, res) => {
    try {
        const messages = await messagesDB.findAll({ where: { type: 'MESSAGE' } }).then((messages) => messages.map((message) => {
            const jsonMessage:Message = message.toJSON();
            return jsonMessage;
        })) as Message[];
        res.status(200).json({ messages });
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

export const getMeasurements: RequestHandler = async (req, res) => {
    try {
        const measurements = await messagesDB.findAll({ where: { type: 'MEASUREMENT' } }).then((measurements) => measurements.map((measurements) => {
            const jsonMeasurement:Measurement = measurements.toJSON();
            return jsonMeasurement;
        })) as Measurement[];
        res.status(200).json({ measurements });
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

export const getLastMessages: RequestHandler = async (req, res) => {
    try {
        const numMsgs = (req.params.numMsgs as unknown as number) || 10; //cast to number, or default to 10
        const messages = await messagesDB.findAll({
            where: { type: 'MESSAGE' },
            limit: numMsgs,
            order: [['time', 'DESC']],
        }).then((messages) => messages.map((messages) => {
            const jsonMessages:Message = messages.toJSON();
            return jsonMessages;
        })) as Message[];
        res.status(200).json(messages);
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

export const getLastMeasurements: RequestHandler = async (req, res) => {
    try {
        const numMsgs = (req.params.numMsgs as unknown as number) || 10; //cast to number, or default to 10
        const measurements = await messagesDB.findAll({
            where: { type: 'MEASUREMENT' },
            limit: numMsgs,
            order: [['time', 'DESC']],
        }).then((measurements) => measurements.map((measurements) => {
            const jsonMeasurements:Measurement = measurements.toJSON();
            return jsonMeasurements;
        })) as Measurement[];
        res.status(200).json(measurements);
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

//this is the dashboard endpoint! includes all we need to display the dashboard
export const getEachNodeLastMeasurements: RequestHandler = async (req, res) => {
    try {
        const nodes = await nodesDB.findAll().then((nodes) => nodes.map((node) => {
            const jsonNode:Node = node.toJSON();
            return jsonNode;
        })) as Node[];
        const plots = await plotsDB.findAll().then((plots) => plots.map((plot) => plot.toJSON()));
        const sensors = await sensorsDB.findAll().then((sensors) => sensors.map((sensor) => sensor.toJSON() as Sensor));
        const measurements = await Promise.all(nodes.map(async (node) => {
            const lastMeasurements = await messagesDB.findAll({
                where: { type: 'MEASUREMENT', nodeID: node.id },
                limit: 20,
                order: [['createdAt', 'DESC']],
            }).then((measurements) => measurements.map((measurements) => {
                const jsonMeasurements:Measurement = measurements.toJSON() as Measurement;
                return jsonMeasurements;
            })) as Measurement[];
            return { node, lastMeasurements };
        }));
        //purge repeated sensor measurements
        const uniqueMeasurements = measurements.map((measurement) => {
            const uniqueMeasurements = measurement.lastMeasurements.reduce((acc, measurement) => {
                if (!acc[measurement.sensorID]){
                    acc[measurement.sensorID] = measurement;
                }
                return acc;
            }, {} as {[key: string]: Measurement});
            return { node: measurement.node, lastMeasurements: Object.values(uniqueMeasurements) };
        });
        res.status(200).json({ nodes: uniqueMeasurements, sensors, plots });
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

export const getMessage: RequestHandler = async (req, res) => {
    try {
        const messageID = req.params.id;
        if (!messageID) {
            res.status(400).json({ message: 'Missing required fields!' });
            return;
        }

        const message = await messagesDB.findOne({ where: { id: messageID, type: 'MESSAGE' } }).then((message) => {
            const jsonMachine:Message|undefined = message?.toJSON();
            return jsonMachine;
        });

        if (!message) {
            res.status(400).json({ message: 'Message not found!' });
        }

        res.status(200).json(message);
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

export const getMeasurementsByID: RequestHandler = async (req, res) => {
    try {
        const measurementID = req.params.id;
        if (!measurementID) {
            res.status(400).json({ message: 'Missing required fields!' });
            return;
        }

        const measurements = await messagesDB.findAll({ where: { id: measurementID, type: 'MEASUREMENT' } }).then((measurements) => measurements.map((measurements) => {
            const jsonMeasurement:Measurement = measurements.toJSON();
            return jsonMeasurement;
        })) as Measurement[];

        if (!measurements) {
            res.status(400).json({ message: 'Measurements not found!' });
        }

        res.status(200).json(measurements);
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

type SerialMessageBody ={
	password:string;
	nodeId: number;
	times: Array<number>; //epoch time, (time since 1970)
	sensors: Array<number>; // array of sensor ids for messages sent in this message (can be multiple messages)
	messages:Array<Array<number>>; // array of messages for sensors, eg [[1,2,3,4],[1,2,3,4]]
}
export const createSerialMessage: RequestHandler = async (req, res) => {
    const body:SerialMessageBody = req.body;
    const { password, nodeId, times, sensors, messages } = body;
    if (password !== serialConfig.password){
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    if ( nodeId === undefined || times === undefined || sensors === undefined || messages === undefined){
        res.status(400).json({ message: 'Missing required fields!' });
        return;
    }
    if ( times.length !== messages.length){
        res.status(400).json({ message: 'Invalid message!' });
        return;
    }
    try {
        const mathParser = parser();
        const nodeID = nodeId.toString();
        const Node = await nodesDB.findOne({ where: { id: nodeID } }).then((node) => node?.toJSON() as Node);
        if (!Node){
            res.status(400).json({ message: 'Node not found!' });
            return;
        }
        const plotID = Node.plotID;
        if (!plotID){
            res.status(400).json({ message: 'Node not assigned to a plot!' });
            return;
        }
        const messagesArray = messages.map((message, index) =>
            ({
                id: v4(),
                nodeID: nodeID,
                plotID: plotID,
                time: new Date(times[index] * 1000),
                type: 'MESSAGE',
                data: message.toString(),
                sk: null,
                sensorID: sensors.toString(),
            }));

        await messagesDB.bulkCreate(messagesArray);

        const lastCreatedMessages = await messagesDB.findAll({ where: { nodeID: nodeID, type: 'MESSAGE' }, order: [['time', 'DESC']], limit: messagesArray.length }).then((messages) => messages.map((message) => message.toJSON() as Message));
        const sensorsByIdMap = await sensorsDB.findAll({ where: { id: sensors } }).then((sensors) => sensors.reduce((acc, _sensor) => {
            const sensor = _sensor.toJSON() as Sensor;
            acc[sensor.id] = sensor;
            return acc;
        }, {} as {[key: number]: Sensor}));

        const measurementsArray = Array<Measurement>();
        messages.forEach((message, index) => {
            sensors.forEach((sensorID) => {
                const sensor = sensorsByIdMap[sensorID];
                if (!sensor){
                    return;
                }
                const measurementData = message[sensorID];
                if (!measurementData){
                    return;
                }
                mathParser.set('x', measurementData);
                const transformedData = mathParser.evaluate(sensor.transformEq);
                const measurementEntry = {
                    id: v4(),
                    nodeID: nodeID,
                    plotID: plotID,
                    time: new Date(times[index] * 1000),
                    type: 'MEASUREMENT',
                    data: transformedData.toString(),
                    sk: lastCreatedMessages[index].id,
                    sensorID: sensorID.toString(),
                } as Measurement;
                measurementsArray.push(measurementEntry);
            });
        });
        if (measurementsArray.length > 0){
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await messagesDB.bulkCreate(measurementsArray as any);
        }

        res.status(200).json({ message: 'Messages created successfully!' });
    }
    catch (e){
        res.status(500).json({ message: e });
        console.log(e);

    }
};

export const findMessagesByNodeID: RequestHandler = async (req, res) => {
    try {
        const nodeID = req.params.nodeID;
        if (!nodeID) {
            res.status(400).json({ message: 'Missing required fields!' });
        }
        const message = await messagesDB.findAll({ where: { nodeID: nodeID, type: 'MESSAGE' } }).then((messages) => messages.map((message) => {
            const jsonMessage:Message = message.toJSON();
            return jsonMessage;
        })) as Message[];

        if (!message){
            res.status(400).json({ message: 'Message not found' });
            return;
        }
        res.status(200).json(message);
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

export const findMeasurementsByNodeID: RequestHandler = async (req, res) => {
    try {
        const nodeID = req.params.nodeID;
        if (!nodeID) {
            res.status(400).json({ message: 'Missing required fields!' });
        }
        const measurement = await messagesDB.findAll({ where: { nodeID: nodeID, type: 'MEASUREMENT' } }).then((measurement) => measurement.map((measurement) => {
            const jsonMeasurement:Measurement = measurement.toJSON();
            return jsonMeasurement;
        })) as Measurement[];

        if (!measurement){
            res.status(400).json({ message: 'Measurement not found' });
            return;
        }
        res.status(200).json(measurement);
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

export const findMessagesByPlotID: RequestHandler = async (req, res) => {
    try {
        const plotID = req.params.plotID;
        if (!plotID) {
            res.status(400).json({ message: 'Missing required fields!' });
        }
        const message = await messagesDB.findAll({ where: { plotID: plotID, type: 'MESSAGE' } }).then((messages) => messages.map((message) => {
            const jsonMessage:Message = message.toJSON();
            return jsonMessage;
        })) as Message[];

        if (!message){
            res.status(400).json({ message: 'Message not found' });
            return;
        }
        res.status(200).json(message);
    } catch (e) {
        res.status(500).json({ message: e });
    }
};

export const findMeasurementsByPlotID: RequestHandler = async (req, res) => {
    try {
        const plotID = req.params.plotID;
        if (!plotID) {
            res.status(400).json({ message: 'Missing required fields!' });
        }
        const measurement = await messagesDB.findAll({ where: { plotID: plotID, type: 'MEASUREMENT' } }).then((measurement) => measurement.map((measurement) => {
            const jsonMeasurement:Measurement = measurement.toJSON();
            return jsonMeasurement;
        })) as Measurement[];

        if (!measurement){
            res.status(400).json({ message: 'Measurement not found' });
            return;
        }
        res.status(200).json(measurement);
    } catch (e) {
        res.status(500).json({ message: e });
    }
};