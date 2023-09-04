const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const routes = require("./routes");
const model = require("./model");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const httpsOptions = {
  key: fs.readFileSync("localhost-key.pem"), // Path to your generated .key file
  cert: fs.readFileSync("localhost.pem"), // Path to your generated .pem file
};
const server = https.createServer(httpsOptions, app);

const io = new Server(server, {
  cors: {
    origin: "https://localhost:3000",
    methods: ["GET", "POST"],
  },
});

dotenv.config();

const PORT = 3001;
app.use(
  cors({
    origin: "https://localhost:3000", // Replace with your frontend domain
    credentials: true, // Enable credentials (cookies)
  })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://localhost:3000"); // Allow requests from this origin
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // Allow specific HTTP methods
  res.setHeader("Access-Control-Allow-Headers", "*"); // Allow specific headers
  next();
});

//auth

//database
app.use("/api", routes);

const connectMongo = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
};
connectMongo();
const database = mongoose.connection;
database.on("error", (error) => {
  console.log("database error", error);
});
database.on("connected", () => {
  console.log("Database Connected");
});

//socket

io.on("connection", async (socket) => {
  console.log(`User Connected: ${socket.id}`);
  //send all messages when connected
  socket.on("connection", async () => {
    socket.emit(
      "get_messages",
      (await model.aggregate().sort({ date: -1 }).limit(10)).reverse()
    );
  });

  //get messages from client and send the same message to client
  socket.on("chat_message", async (data) => {
    console.log(data);
    io.emit("get_message", data);
    const newMessage = new model({
      date: data.date,
      message: data.message,
      user: data.user,
    });
    await newMessage.save();
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
