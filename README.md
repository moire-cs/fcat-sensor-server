# FCAT-Sensor-Server
This repository contains the backend code for the Moiré project, which aims to automate the soil data collection process of FCAT's reforestation efforts.

![image](https://github.com/moire-cs/fcat-sensor-server/assets/19416922/446a6212-8f5b-486c-9e83-50ffb3ff5056)


## Motivation
FCAT is an Equadorian NGO responsible for the conservation of a 650-hectare reserve in the tropical Andes. Last year, FCAT acquired a property spanning 42-hectares, with plans to use the land as a hub for forest restoration and research. Working with a large collaborative team across many institutions, FCAT monitors recovery outcomes for a wide range of ecological processes over the course of the restoration experiment. These efforts depend on daily collection of soil data, a process currently done by hand. Moiré aims to automate the data collection process (in addition to increasing its accuracy) with a mesh network of sensors distributed across the reserve, which measure and transmit data daily. This data will be accessible on an interactive website, also built by the Moiré team.

## Configuration
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
