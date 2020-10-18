const express = require('express');
const http = require('http');
const mongoose = require("mongoose");
const cors = require('cors');
const path = require('path');
const socketio = require('socket.io');

require('dotenv').config();

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const indexRouter = require('./Routers/indexRouter');
const userRouter = require('./Routers/userRouter');
const followRouter = require('./Routers/followRouter');
const postRouter = require("./Routers/postRouter");
const likeRouter = require('./Routers/likeRouter');
const commentRouter = require('./Routers/commentRouter');
const chatInfoRouter = require('./Routers/Chat/chatInfoRouter');
const {sendMessage, Chat} = require('./Routers/Chat/chatsRouter');

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", 'http://localhost:3000')
	res.setHeader("Access-Control-Allow-Methods", 'GET, POST, DELETE')
	res.setHeader("Access-Control-Allow-Headers", 'Content-Type', "Authorization")
	next();
})

app.use(express.static(path.join(__dirname, "/public/")));
app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/follow', followRouter);
app.use("/posts", postRouter);
app.use("/likes", likeRouter);
app.use("/comments", commentRouter);
app.use('/chats', chatInfoRouter);

io.on('connection', socket => {
	console.log("a user connected.");

	socket.on('getInfo', ({from, to}) => {
		let messages = [];
		Chat.find({from, to})
		.then(chats => {
			chats.forEach((chat) => messages.push(chat))
			Chat.find({from: to, to: from})
			.then(chats => {
				chats.forEach((chat) => messages.push(chat))
				messages = messages.sort((a, b) => (a._id > a._id) ? 1: ((b._id > a._id)?-1: 0))
				socket.emit("ChatInfo", messages);
			})
		})
	})
	
	socket.on('sendMessage', ({message, from, to}, callback) => {
		sendMessage({message, from, to})

		socket.broadcast.emit('receiveMessage', {chat: message, from, to})
	})
	socket.on('disconnect', () => {
		console.log("a user disconnected.")
	})
})

app.use(function (req, res, next) {
	res.status(404).sendFile(__dirname + "/error/404.html")
})

server.listen(PORT, ()=> console.log(`Server has started on port ${PORT}`))

app.use(express.json());
app.use(cors());


const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});

const connection = mongoose.connection;

connection.once('open', ()=>{
	console.log("MongoDB database connection established successfully");
})

