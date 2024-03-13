import mongoose from 'mongoose';

const ThreadSchema = new mongoose.Schema(
  {
    thread_id: {
      type: String,
      required: true,
    },
    user: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      type: {
        type: String,
        enum: ['User', 'Contractor'],
        required: true,
      },
    },
    last_viewed: {
      type: Date,
      default: Date.now,
    },
}, { timestamps: true });

const Thread = mongoose.model('Thread', ThreadSchema);
export default Thread;