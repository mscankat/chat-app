import mongoose from "mongoose";
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
export default mongoose.models.Message ||
  mongoose.model("Message", messageSchema);
