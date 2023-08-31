const mongoose = require("mongoose");
const Message = require("./model");
const express = require("express");
const router = express.Router();

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

router.post("/post", async (req, res) => {
  console.log(req.body);
  const message = new Message({
    date: new Date().valueOf(),
    message: req.body.message,
    user: req.body.user,
  });
  try {
    const dataToSave = await message.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const code = req.body.code;
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const tokenUrl = `https://github.com/login/oauth/access_token`;
  console.log(req);
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      credentials: "include",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
    }),
  };

  const response = await fetch(tokenUrl, options);
  const data = await response.json();
  // console.log(data);
  const accessToken = data.access_token;
  console.log(accessToken);
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    // domain: "https://localhost:3000",
  });
  res.json("cookies");
});

router.get("/user", async (req, res) => {
  console.log(req.headers.cookie);
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow requests from this origin
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // Allow specific HTTP methods
  res.setHeader("Access-Control-Allow-Headers", "*"); // Allow specific headers
  res.setHeader("credentials", "include");
  console.log(req.cookies);
  res.send("ok");
});

module.exports = router;
