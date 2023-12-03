require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const { dbConnection } = require('./services/db');
const apiRouter = require('./routes/index.router');

const app = express();

// Database connection
dbConnection()
    .then(() => {
        // Middlewares
        app.use(logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(cookieParser());
        app.use(cors());
        
        // Routes
        app.use('/api', apiRouter);

        // Start the server
        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => {
            console.log(`API listening on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error(error);
        process.exit(1); // Terminate the application if there's an error connecting to the database
    });

module.exports = app;
