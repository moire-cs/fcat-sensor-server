import { ModelAttributes } from 'sequelize';
import { DataTypes } from 'sequelize';

export const logModel:ModelAttributes = {
    time: {
        type: DataTypes.DATE(3),
    },
    message: {
        type: DataTypes.STRING,
    },
    type: {
        type: DataTypes.STRING,
    },
    messageID: {
        type: DataTypes.STRING, //string, foreign key to message
    },
};