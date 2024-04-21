import { ModelAttributes, DataTypes } from 'sequelize';

export const sensorsModel:ModelAttributes = {
    id: {
        type: DataTypes.NUMBER,
        primaryKey: true,
        defaultValue: DataTypes.NUMBER,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    length: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    transformEq: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    typicalRange: {
        type: DataTypes.JSON,
        allowNull: false,
    },
};

export type Sensor = {
    id: number;
	name: string;
	description?: string;
	length: number;
	transformEq: string;
	typicalRange?:[number,number];
}