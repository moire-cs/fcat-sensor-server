import { ModelAttributes } from 'sequelize';
import { DataTypes } from 'sequelize';

export const messagesModel:ModelAttributes = {
    messageID: {
        type: DataTypes.STRING,
    },
    deviceID: {
        type: DataTypes.STRING, //foreign key
    },
    time: {
        type: DataTypes.DATE(3),
    },
    battery: {
        type: DataTypes.DOUBLE,
    },
    soilCondition: {
        type: DataTypes.DOUBLE,
    },
    humidity: {
        type: DataTypes.DOUBLE,
    },
    temperature: {
        type: DataTypes.DOUBLE,
    },
    //sunlight: {
    //  type: Sequelize.DOUBLE
    //}
};
// Sequelize is adding createdAt, modifiedAt
// Sequelize is adding createdAt, modifiedAt