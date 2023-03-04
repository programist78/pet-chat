import mongoose from 'mongoose';

const User = new mongoose.Schema(
  {
   user1: {type :String},
   user2: {type :String},
   messages: { type: mongoose.Schema.Types.Array},
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('chat', Chat);