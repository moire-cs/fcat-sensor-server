import { ModelAttributes,DataTypes } from 'sequelize';

export const cycleModel:ModelAttributes = {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    numMessages: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    syncDuration: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    gateTolerance: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },

};

export type CycleEntry = {
    id: string;
    duration: number;
    numMessages: number;
    syncDuration: number;
    gateTolerance: number;
}
