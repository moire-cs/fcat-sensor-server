import { Express } from 'express';
import * as messagesController from '../controllers/messages.controller';
import { authenticate } from '../controllers/users.controller';

const URL_BASE = '/api';
const AUTH = authenticate;

export const useMessageRoutes = (router:Express) => {
    router.get(URL_BASE + '/messages', AUTH, messagesController.getMessages);
    router.get(URL_BASE + '/messages/:id', AUTH, messagesController.getMessage);
    router.post(URL_BASE + '/messages/', AUTH, messagesController.createMessage);
    router.get(URL_BASE + '/messages/:nodeID', AUTH, messagesController.findMessagesByNodeID);
    router.get(URL_BASE + '/messages/:plotID', AUTH, messagesController.findMessagesByPlotID);
    router.get(URL_BASE + '/messages/last/:numMsgs?', AUTH, messagesController.getLastMessages);
    router.get(URL_BASE + '/measurements', AUTH, messagesController.getMeasurements);
    router.get(URL_BASE + '/measurements/last/:numMsgs?', AUTH, messagesController.getLastMeasurements);
    router.get(URL_BASE + '/measurements/:id', AUTH, messagesController.getMeasurementsByID);
    router.post(URL_BASE + '/measurements/', AUTH, messagesController.createMeasurement);
    router.get(URL_BASE + '/measurements/:nodeID', AUTH, messagesController.findMeasurementsByNodeID);
    router.get(URL_BASE + '/measurements/:plotID', AUTH, messagesController.findMeasurementsByPlotID);
};
