import { messagesDB } from '../models/db.index';
import { RequestHandler } from 'express';
import createHttpError from 'http-errors';

export const getMessages: RequestHandler = async (req, res, errFunc) => {
    try {
        const messages = await messagesDB.findAll();
        res.status(200).json(messages);
    } catch (error) {
        errFunc(error);
    }
};
export const getLastMessages: RequestHandler = async (req, res, errFunc) => {
    try {
        const numMsgs = (req.params.numMsgs as unknown as number) || 10; //cast to number, or default to 10
        const messages = await messagesDB.findAll({
            limit: numMsgs,
            order: [['id', 'DESC']],
        });
        res.status(200).json(messages);
    } catch (error) {
        errFunc(error);
    }
};

export const getMessage: RequestHandler = async (req, res, errFunc) => {
    const messageId = req.params.messageId;

    try {
        const message = await messagesDB.findByPk(messageId);

        if (!message) {
            throw createHttpError(400, 'Message not found');
        }

        res.status(200).json(message);
    } catch (error) {
        errFunc(error);
    }
};

// interface CreateMessageBody {
//     nodeId?:string;
//     temperature?:number,
//     sunlight?:number,
//     battery?:number,
//     soilConductivity?:number,
//     humidity?:number,
// }

// export const createMessage: RequestHandler<unknown, unknown, CreateMessageBody, unknown> = async (req, res, errFunc) => {
//     const nodeId = req.body.nodeId;

//     try {
//         if (!nodeId) {
//             throw createHttpError(400, 'Message must have a ???');
//         }
//     } catch (error) {

//     }
// };

/// export const create = async(req:Express.Request, res:Express.Response) => {
///
///     try {
///         const messageBody = req.body as MessageBody;
///
///         if (!messageBody.nodeID){
///             res.status(400).send({ message: 'NodeID is required!' });
///         } else {
///             const data = await messagesModel.create(messageBody);
///             res.send(data);
///         }
///
///     } catch (error) {
///         res.status(500).send({ message: 'Some error occurred while creating the message!' });
///
///     }
/// };