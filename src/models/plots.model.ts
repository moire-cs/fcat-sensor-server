import { ModelAttributes } from 'sequelize';
import { DataTypes } from 'sequelize';

export const plotsModel:ModelAttributes = {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nodeID: {
        type: DataTypes.STRING,
        references: {
            model: 'nodes',
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