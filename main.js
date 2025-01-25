// importing libraries
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname + '/.env') });
const express = require('express');
const environment = require('./environemnts');
const mongoose = require('mongoose');
const todoHandler = require('./routeHandler/todoHandler');
const userHandler = require('./routeHandler/userHandler');
const currentDataBase = 'Todo-App';

// express app init
const app = express();
app.use(express.json());

// database connection with mongoose
mongoose.connect(`mongodb://localhost/Todo-App`)
    .then(()=> console.log(`connected successful to ${currentDataBase}`))
    .catch((err)=> console.log(err));

// application routes
app.use('/todo', todoHandler);

// user routes
app.use('/user', userHandler);

// default error handler
const errorHandler = (err, req, res, next)=> {
    if(req.headersSent){
        return next(err);
    }
    res.status(500).json({ error: err });
};

app.use(errorHandler);

app.listen((environment.port) , () => {
    console.log(`listeing to port ${environment.port}`);
});
