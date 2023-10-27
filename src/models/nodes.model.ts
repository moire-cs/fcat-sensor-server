import { ModelAttributes } from 'sequelize';
import { DataTypes } from 'sequelize';
import { plotsDB } from './db.index';

export const nodesModel:ModelAttributes = {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    plotID: {
        type: DataTypes.STRING,
        references: {
            model: plotsDB,
            key: 'id',
        },
    },
    lastSeen: {
        type: DataTypes.DATE(3),
    },
};