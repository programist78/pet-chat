import mongoose from 'mongoose';

const Messages = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('messages', Messages);