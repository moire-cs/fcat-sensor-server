import { ModelAttributes } from 'sequelize';
import { DataTypes } from 'sequelize';

export const messagesModel:ModelAttributes = {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    nodeID: {
        type: DataTypes.STRING,
        references: {
            model: 'nodes',
            key: 'id',
        },
    },
    plotID:{
        type: DataTypes.STRING,
        references: {
            model: 'plots',
            key: 'id',
        },
    },
    time: {
        type: DataTypes.DATE(3),
    },
    battery: {
        type: DataTypes.DOUBLE,
    },
    soilConductivity: {
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