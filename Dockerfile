FROM node:18

RUN apt-get update && apt-get install -y default-mysql-server

WORKDIR /app

COPY fcat-sensor-server/package*.json ./server/
RUN cd server && npm install

COPY fcat-sensor-client/package*.json ./client/
RUN cd client && npm install

COPY fcat-sensor-client/ ./client/
RUN cd client && npm run build

COPY fcat-sensor-server/ ./server/
RUN cp -r client/build server/build

WORKDIR /app/server

ENV SERIAL_PORT=/dev/ttyUSB0

EXPOSE 8080

CMD mysqld_safe & \
    sleep 5 && \
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS moiredb; CREATE USER IF NOT EXISTS 'moire_user'@'localhost' IDENTIFIED BY '62*hvzx6'; GRANT ALL PRIVILEGES ON moiredb.* TO 'moire_user'@'localhost'; FLUSH PRIVILEGES;" && \
    IS_PROD=true npx ts-node index.ts
