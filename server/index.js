const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const routes = require("./routes");
const model = require("./model");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

dotenv.config();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const PORT = 3001;
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow requests from this origin
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // Allow specific HTTP methods
  res.setHeader("Access-Control-Allow-Headers", "*"); // Allow specific headers
  next();
});

//auth
app.post("/", async (req, res) => {
  const code = req.body.code;
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const tokenUrl = `https://github.com/login/oauth/access_token`;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
    }),
  };

  const response = await fetch(tokenUrl, options);
  const data = await response.json();
  console.log(data);
  res.json(data.access_token);
});

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
  socket.emit(
    "get_messages",
    (await model.aggregate().sort({ date: -1 }).limit(10)).reverse()
  );
  socket.on("join_room", (data) => {
    console.log(data);
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });
  socket.on("chat_message", async (data) => {
    console.log(data);
    socket.emit("get_message", data);
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
