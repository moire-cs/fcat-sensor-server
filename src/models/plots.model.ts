import { ModelAttributes } from 'sequelize';
import { DataTypes } from 'sequelize';
import { nodesDB } from './db.index';

export const plotsModel:ModelAttributes = {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    currentNode: {
        type: DataTypes.STRING,
        references: {
            model: nodesDB,
            key: 'id',
        },
    },
    latitude: {
        type: DataTypes.DOUBLE,
    },
    longitude: {
        type: DataTypes.DOUBLE,
    },
    description: {
        type: DataTypes.STRING,
    },
};