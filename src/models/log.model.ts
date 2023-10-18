import { ModelAttributes } from 'sequelize';
import { DataTypes } from 'sequelize';
import { messagesDB } from './db.index';

export const logModel:ModelAttributes = {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    time: {
        type: DataTypes.DATE(3),
    },
    message: {
        type: DataTypes.STRING,
    },
    type: {
        type: DataTypes.STRING,
    },
    messageID: {
        type: DataTypes.STRING,
        references: {
            model: messagesDB,
            key: 'id',
        },
    },
};