const mongoose = require("mongoose");
const Message = require("./model");
const express = require("express");
const router = express.Router();

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

module.exports = router;
