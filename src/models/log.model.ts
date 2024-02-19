import { ModelAttributes, DataTypes } from 'sequelize';

export const logModel:ModelAttributes = {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    time: {
        type: DataTypes.DATE(3),
        allowNull: false,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    messageID: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    plotID: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    nodeID: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    userID: {
        type: DataTypes.STRING,
        allowNull: true,
    },
};

export type Log = {
    id: string,
    time: Date,
    message: string,
    type: string,
    messageID: string|null,
    plotID: string|null,
    nodeID: string|null,
    userID: string|null,
}