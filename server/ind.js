const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("qwe");
});
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow requests from this origin
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // Allow specific HTTP methods
  res.setHeader("Access-Control-Allow-Headers", "*"); // Allow specific headers
  next();
});
app.post("/", async (req, res) => {
  console.log(req.body);

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
  console.log(data.access_token);
  res.json(data.access_token);
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });
  socket.on("chat_message", (data) => {
    console.log(data);
    socket.emit("get_message", data);
  });
});

server.listen(3001, () => {
  console.log("listening on *:3000");
});
