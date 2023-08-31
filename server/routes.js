const mongoose = require("mongoose");
const Message = require("./model");
const express = require("express");
const router = express.Router();

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const userURL = "https://api.github.com/user";
const userData = async (token) => {
  try {
    const response = await fetch(userURL, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const data = await response.json();
    // console.log(data);
    if (data.login) {
      return data;
    }
    return null;
  } catch (e) {
    console.log(e, "fetch error");
  }
};

const isLoggedIn = async (token) => {
  try {
    const response = await fetch(userURL, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    console.log(await response.json());
    if (response.status >= 400) {
      return false;
    }
    return true;
  } catch (e) {
    console.log(e, "fetch error");
  }
};

// /POST endpoint

router.post("/post", async (req, res) => {
  const accessToken = req.cookies["accessToken"];
  const userData = userData(accessToken);
  console.log(req.cookies);
  if (!isLoggedIn(accessToken)) {
    console.log("not logged");
    return;
  }
  console.log(req.body);
  const message = new Message({
    date: new Date().valueOf(),
    message: req.body.message,
    user: userData.login,
  });
  try {
    const dataToSave = await message.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// / endpoint

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

// /USER endpoint

router.get("/user", async (req, res) => {
  const accessToken = req.cookies["accessToken"];
  const user = await userData(accessToken);
  console.log(user);
  let dataToSend;
  if (user) {
    dataToSend = { name: user.login };
  } else {
    dataToSend = { message: "user not logged in" };
  }
  console.log(dataToSend);
  res.send(dataToSend);
});

module.exports = router;
