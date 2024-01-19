import { Express } from 'express';
import * as messagesController from '../controllers/messages.controller';

const URL_BASE = '/api/messages';

export const useMessageRoutes = (router:Express) => {
    router.get(URL_BASE, messagesController.getMessages);
    router.get(URL_BASE + '/:id', messagesController.getMessage);
    router.post(URL_BASE + '/', messagesController.createMessage);
    router.patch(URL_BASE + '/updateMessage/:id', messagesController.updateMessage);
    router.delete(URL_BASE + '/deleteMessage/:id', messagesController.deleteMessage);
    router.get(URL_BASE + '/:nodeID', messagesController.findMessagesByNodeID);
    router.get(URL_BASE + '/:plotID', messagesController.findMessagesByPlotID);
    router.get(URL_BASE + '/last/:numMsgs?', messagesController.getLastMessages);
};
