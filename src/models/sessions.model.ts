import { DataTypes, ModelAttributes } from 'sequelize';
export const EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 7; // 7 days
export const sessionsModel:ModelAttributes = {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    expires: {
        type: DataTypes.DATE    },
    token: {
        type: DataTypes.STRING,
    },
    userID: {
        type: DataTypes.STRING,
        references: {
            model: 'users',
            key: 'id',
        },
    },
};
