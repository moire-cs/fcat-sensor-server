import { Express } from 'express';
import * as messagesController from '../controllers/messages.controller';

const URL_BASE = '/api';

export const useMessageRoutes = (router:Express) => {
    router.get(URL_BASE + '/messages', messagesController.getMessages);
    router.get(URL_BASE + '/messages/:id', messagesController.getMessage);
    router.post(URL_BASE + '/messages/', messagesController.createMessage);
    router.get(URL_BASE + '/messages/:nodeID', messagesController.findMessagesByNodeID);
    router.get(URL_BASE + '/messages/:plotID', messagesController.findMessagesByPlotID);
    router.get(URL_BASE + '/messages/last/:numMsgs?', messagesController.getLastMessages);
    router.get(URL_BASE + '/measurements', messagesController.getMeasurements);
    router.get(URL_BASE + '/measurements/last/:numMsgs?', messagesController.getLastMeasurements);
    router.get(URL_BASE + '/measurements/:id', messagesController.getMeasurementsByID);
    router.post(URL_BASE + '/measurements/', messagesController.createMeasurement);
    router.get(URL_BASE + '/measurements/:nodeID', messagesController.findMeasurementsByNodeID);
    router.get(URL_BASE + '/measurements/:plotID', messagesController.findMeasurementsByPlotID);
};
