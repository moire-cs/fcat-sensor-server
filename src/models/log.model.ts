import { ModelAttributes } from 'sequelize';
import { DataTypes } from 'sequelize';

export const logModel:ModelAttributes = {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    time: {
        type: DataTypes.DATE(3),
    },
    message: {
        type: DataTypes.STRING,
    },
    type: {
        type: DataTypes.STRING,
    },
    referenceID: { //how to make this point to multiple dbs potentially?
        type: DataTypes.STRING,
        references: {
            model: 'messages',
            key: 'id',
        },
    },
};