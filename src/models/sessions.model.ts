import { ModelAttributes, DataTypes } from 'sequelize';

export const EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 7; // 7 days

export const sessionsModel:ModelAttributes = {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    expires: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userID: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
};

export type Session = {
    id: string,
    expires: Date,
    token: string,
    userID: string,
}