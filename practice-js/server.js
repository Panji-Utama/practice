require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json());

// Router Group
const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

// MySQL Setup
const mysqlConnection = require('./mysqlConnection');

app.listen(process.env.PORT, () =>
    console.log(`Server started at Port ${process.env.PORT}`)
);

app.get('/', (req, res) => {
    res.status(201).json({ status: 'Server is running' });
});
