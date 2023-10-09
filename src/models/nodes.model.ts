import { ModelAttributes } from 'sequelize';
import { DataTypes } from 'sequelize';

export const nodesModel:ModelAttributes = {
    deviceID: {
        type: DataTypes.STRING,
    },
    plot: {
        type: DataTypes.STRING,
    },
    latitude: {
        type: DataTypes.DOUBLE,
    },
    longitude: {
        type: DataTypes.DOUBLE,
    },
    lastSeen: {
        type: DataTypes.DATE(3),
    },
};
// Sequelize is adding createdAt, modifiedAt