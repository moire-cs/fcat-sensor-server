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
    syncTimeTolerance: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    meshTimeTolerance: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
};

export type CycleEntry = {
    id: string;
    duration: number;
    numMessages: number;
    syncTimeTolerance: number;
    meshTimeTolerance: number;
}
