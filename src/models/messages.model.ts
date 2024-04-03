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
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    data: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sk: {
        type: DataTypes.STRING,
        allowNull: false,
    },
};

export interface MessageEntry {
    id: string;
    nodeID: string;
    plotID: string;
    time: Date;
    type: 'MESSAGE' | 'MEASUREMENT';
    data: string;
    sk: string|null;
}

export interface Message extends MessageEntry {
    type: 'MESSAGE';
    sk: null;
}

export interface Measurement extends MessageEntry {
    type: 'MEASUREMENT';
    sk: string;
}