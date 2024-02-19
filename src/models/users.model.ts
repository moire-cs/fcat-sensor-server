import { ModelAttributes, DataTypes } from 'sequelize';

export const usersModel:ModelAttributes = {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    preferences: {
        type: DataTypes.JSON,
        defaultValue: {},
        allowNull: true,
    },
};

export type User = {
    id: string,
    name: string,
    password: string,
    type: UserType,
    email: string,
    preferences: object|null,
}

export type UserType = 'admin' | 'user';