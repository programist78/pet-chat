import mongoose from 'mongoose';

const User = new mongoose.Schema(
  {
    nick: {
      type: String,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: 
      {type: String,
    },
    status: {type: String},
    token: { type: String },
    friend_sent: { type: mongoose.Schema.Types.Array },
    friend_pending: { type: mongoose.Schema.Types.Array },
    friends: { type: mongoose.Schema.Types.Array},
    avatarUrl: { type: String },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('User', User);