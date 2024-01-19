import { ModelAttributes } from 'sequelize';
import { DataTypes } from 'sequelize';

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
            model: 'messages',
            key: 'id',
        },
    },
    plotID: {
        type: DataTypes.STRING,
        references: {
            model: 'plots',
            key: 'id',
        },
    },
    nodeID: {
        type: DataTypes.STRING,
        references: {
            model: 'nodes',
            key: 'id',
        },
    },
    userID: {
        type: DataTypes.STRING,
        references: {
            model: 'users',
            key: 'id',
        },
    },
};