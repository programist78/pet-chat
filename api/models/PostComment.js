import mongoose from 'mongoose';

const PostCommentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    user: {
      // type: mongoose.Schema.Types.ObjectId,
      // ref: 'User',
      type: String,
      required: true,
    },
    answers: { type: mongoose.Schema.Types.Array, ref: 'AnswerComment' },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('PostComment', PostCommentSchema);