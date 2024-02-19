import { ModelAttributes, DataTypes } from 'sequelize';

export const messagesModel:ModelAttributes = {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    nodeID: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    plotID:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    time: {
        type: DataTypes.DATE(3),
        allowNull: false,
    },
    battery: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    soilConductivity: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    humidity: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    temperature: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    sunlight: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
};

export type Message = {
    id: string,
    nodeID: string,
    plotID: string,
    time: Date,
    battery: number,
    soilConductivity: number,
    humidity: number,
    temperature: number,
    sunlight: number,
}