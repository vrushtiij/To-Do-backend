const express = require('express')
const bodyparser = require('body-parser')
const cors = require("cors");
const cookieParser = require('cookie-parser')

const userRoutes = require('./routes/userRoutes')
const db = require('./db');

const app = express();
db();

app.use(cookieParser())
app.use(bodyparser.json())

app.use(cors({
  origin:"https://to-do-frontend-one-mu.vercel.app/",
  credentials: true,
}));


app.use('/api', userRoutes)

module.exports = app;