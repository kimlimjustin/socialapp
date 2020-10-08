const express = require('express');
const http = require('http');
const mongoose = require("mongoose");
const cors = require('cors');

require('dotenv').config();

const PORT = process.env.PORT || 5000;

const app = express();
const indexRouter = require('./Routers/indexRouter');
const userRouter = require('./Routers/userRouter');

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", 'http://localhost:3000')
	res.setHeader("Access-Control-Allow-Methods", 'GET, POST')
	res.setHeader("Access-Control-Allow-Headers", 'Content-Type', "Authorization")
	next();
})

app.use('/', indexRouter);
app.use('/users', userRouter);

const server = http.createServer(app);

server.listen(PORT, ()=> console.log(`Server has started on port ${PORT}`))

app.use(express.json());
app.use(cors());


const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});

const connection = mongoose.connection;

connection.once('open', ()=>{
	console.log("MongoDB database connection established successfully");
})

