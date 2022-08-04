// const mongoose = require("mongoose");
import mongoose from 'mongoose';

let db;
let isConnected = false;

const init = () => {
    return new Promise((resolve, reject) => {
        // console.log(mongoose.connection.states, mongoose.connection.readyState);
        isConnected = mongoose.connection.readyState == '1';

        if (isConnected) {
            resolve(db);
            return;
        }

        mongoose.connect(`mongodb://${process.env.DB_HOST}`, {
            dbName: process.env.DB_NAME,
            user: process.env.DB_USER,
            pass: process.env.DB_PASS,
            authSource: process.env.DB_AUTH,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            readPreference: 'primary',
        });

        db = mongoose.connection;
        db.on('error', function (e) {
            console.error(e);
            isConnected = false;
            reject(e);
        });
        db.on('open', function () {
            console.log('DB Connected!');
            isConnected = true;
            resolve(db);
        });
    });
};

const Database = {
    init,
    isConnected,
    db,
};

export default Database;
