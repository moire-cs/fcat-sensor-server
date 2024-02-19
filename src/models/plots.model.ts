import { ModelAttributes, DataTypes } from 'sequelize';

export const plotsModel:ModelAttributes = {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    nodeID: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
            model: 'nodes',
            key: 'id',
        },
    },
    latitude: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    longitude: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
};

export type Plot = {
    id: string,
    nodeID: string|null,
    latitude: number,
    longitude: number,
    description: string,
}