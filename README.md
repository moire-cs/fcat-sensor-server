# configuring database login
To configure the database login, add a file "db.config.ts" to the "src/config" directory with the following (Edited for your mysql database)
```ts
export const dbConfig = {
    HOST: 'localhost',
    USER: 'root',
    PASSWORD: '123456',
    DB: 'moirelocal',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};
```