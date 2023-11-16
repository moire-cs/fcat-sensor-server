import { ModelAttributes } from 'sequelize';
import { DataTypes } from 'sequelize';

export const nodesModel:ModelAttributes = {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    plotID: {
        type: DataTypes.STRING,
        references: {
            model: 'plots',
            key: 'id',
        },
    },
    lastSeen: {
        type: DataTypes.DATE(3),
    },
};