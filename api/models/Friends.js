import mongoose from 'mongoose';

const Friends = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId('5aabbccddeeff00112233445')
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    friend_sent: { type: mongoose.Schema.Types.Array },
    friend_pending: { type: mongoose.Schema.Types.Array },
    friends: { type: mongoose.Schema.Types.Array},
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Friends', Friends);