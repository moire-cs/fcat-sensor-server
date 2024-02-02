import { ModelAttributes, DataTypes } from 'sequelize';

export const nodesModel:ModelAttributes = {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    plotID: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
            model: 'plots',
            key: 'id',
        },
    },
    lastSeen: {
        type: DataTypes.DATE(3),
        allowNull: true,
    },
};

export type Node = {
    id: string,
    plotID: string|null,
    lastSeen: Date|null,
}