import { ModelAttributes } from 'sequelize';
import { DataTypes } from 'sequelize';

export const usersModel:ModelAttributes = {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    name: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
    },
    admin: {
        type: DataTypes.BOOLEAN,
    },
    email: {
        type: DataTypes.STRING,
    },
    preferences: {
        type: DataTypes.STRING,
    },
};