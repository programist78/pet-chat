import mongoose from 'mongoose';

const Post = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
        type: String,
        required: true,
    },
    price: {
      type: Number,
      required: true,
  },
    viewsCount: {
      type: Number,
      default: 0,
    },
    images: {},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PostComment' }],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('post', Post);