import { Express } from 'express';
import * as messagesController from '../controllers/messages.controller';

const URL_BASE = '/api/messages';

export const useMessageRoutes = (router:Express) => {
    router.get(URL_BASE, messagesController.getMessages);
    router.get(URL_BASE + '/:messageId', messagesController.getMessage);
    ///router.post create
    ///router.patch update
    ///router.delete delete

};

