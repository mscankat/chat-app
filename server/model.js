const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  date: {
    required: true,
    type: Number,
  },
  message: {
    required: true,
    type: String,
  },
  user: {
    required: true,
    type: String,
  },
});

module.exports = mongoose.model("Message", messageSchema);
