import mongoose from 'mongoose';

const AnswerCommentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('AnswerComment', AnswerCommentSchema);