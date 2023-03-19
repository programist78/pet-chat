import mongoose from 'mongoose';

const Chat = new mongoose.Schema(
  {
   user1: {type :String},
   user2: {type :String},
   messages: { type: mongoose.Schema.Types.Array},
   lastMessage: { type: mongoose.Schema.Types.Object},
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('chat', Chat);