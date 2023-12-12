import mongoose from "mongoose";

const messagesCollection = 'messages'
const messagesSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    message: {
      type: String
    }
  },
  {
    timestamps: true
  }
  
)

export const messagesModel = mongoose.model(messagesCollection, messagesSchema)