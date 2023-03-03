import mongoose from 'mongoose';

const User = new mongoose.Schema(
  {
    fullname: {
      type: String
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
    confirmationCode: { type: String }, 
    balance: {type: Number},
    donate: {type: Number},
    avatarUrl: { type: String },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('User', User);