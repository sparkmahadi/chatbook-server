const express = require("express");
const cors = require('cors');
const port = process.env.PORT || 5000;
const dotenv = require('dotenv');
const connectDB = require("./config/db");
dotenv.config();

const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

connectDB();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound)
app.use(errorHandler)

app.get("/", (req, res) => {
    res.send("API is running..");
  });

const server = app.listen(port, console.log(`chatbook server is running on port ${port}`));

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors:{
    origin: 'http://localhost:3000'
  }
})

io.on("connection", (socket)=>{
  console.log("connected to socket, user");
  socket.on("setup", (userData) => {
    console.log(userData._id);
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("joinChat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("newMessage", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) {
      return console.log("chat.users not defined")
    };

    chat.users.forEach((user) => {
      console.log(user);
      if (user._id == newMessageReceived.sender._id) return;
      console.log(user._id);
      
      socket.in(user._id).emit("messageReceived", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });

})