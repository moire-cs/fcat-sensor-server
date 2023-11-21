import { Express } from 'express';
import * as messagesController from '../controllers/messages.controller';
import { authenticate } from '../controllers/users.controller';

const URL_BASE = '/api/messages';

export const useMessageRoutes = (router:Express) => {

    router.get(URL_BASE,authenticate, messagesController.getMessages);
    router.get(URL_BASE + '/:messageId', authenticate, messagesController.getMessage);
    ///router.post create
    ///router.patch update
    ///router.delete delete
};

