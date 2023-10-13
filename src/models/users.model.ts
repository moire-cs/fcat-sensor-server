import { ModelAttributes } from 'sequelize';
import { DataTypes } from 'sequelize';

export const usersModel:ModelAttributes = {
    name: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
    },
    userID: {
        type: DataTypes.STRING,
    },
    admin: {
        type: DataTypes.BOOLEAN,
    },
    email: {
        type: DataTypes.STRING,
    },
    prefs: {
        type: DataTypes.STRING, //not sure how to make this an array
    },
};
// Sequelize is adding createdAt, modifiedAt