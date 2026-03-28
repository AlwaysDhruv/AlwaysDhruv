import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    _id: false,
    timestamps: true
  }
);

const chatSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'New Chat'
    },
    messages: {
      type: [messageSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

export const Chat = mongoose.model('Chat', chatSchema);
