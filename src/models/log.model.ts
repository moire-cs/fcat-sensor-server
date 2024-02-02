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
        references: {
            model: 'messages',
            key: 'id',
        },
    },
    plotID: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
            model: 'plots',
            key: 'id',
        },
    },
    nodeID: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
            model: 'nodes',
            key: 'id',
        },
    },
    userID: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id',
        },
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