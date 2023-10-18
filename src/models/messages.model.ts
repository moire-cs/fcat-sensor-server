import { ModelAttributes } from 'sequelize';
import { DataTypes } from 'sequelize';
import { nodesDB, plotsDB } from './db.index';

export const messagesModel:ModelAttributes = {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nodeID: {
        type: DataTypes.STRING,
        references: {
            model: nodesDB,
            key: 'id',
        },
    },
    plotID:{
        type: DataTypes.STRING,
        references: {
            model: plotsDB,
            key: 'id',
        },
    },
    time: {
        type: DataTypes.DATE(3),
    },
    battery: {
        type: DataTypes.DOUBLE,
    },
    soilCondition: {
        type: DataTypes.DOUBLE,
    },
    humidity: {
        type: DataTypes.DOUBLE,
    },
    temperature: {
        type: DataTypes.DOUBLE,
    },
    sunlight: {
        type: DataTypes.DOUBLE,
    },
};