import { ModelAttributes,DataTypes } from 'sequelize';

export const cycleModel:ModelAttributes = {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    duration: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    numMessages: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    gateTolerance: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },

};

export type CycleEntry = {
    id: string;
    duration: number;
    numMessages: number;
    gateTolerance: number;
}
