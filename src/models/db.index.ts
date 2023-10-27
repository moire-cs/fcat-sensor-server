import { dbConfig } from '../config/db.config';
import { Dialect, Sequelize } from 'sequelize';
import { logModel } from './log.model';
import { nodesModel } from './nodes.model';
import { messagesModel } from './messages.model';
import { usersModel } from './users.model';
import { plotsModel } from './plots.model';

export const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect as Dialect,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
    },
});

export const usersDB = sequelize.define('users',usersModel);
export const nodesDB = sequelize.define('nodes',nodesModel);
export const messagesDB = sequelize.define('messages',messagesModel);
export const logDB = sequelize.define('log',logModel);
export const plotsDB = sequelize.define('plots',plotsModel);
