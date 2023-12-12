import mongoose from "mongoose";

const productsCollection = 'products'
const productsSchema = new mongoose.Schema(
  {
    id:{
      type: Number, required: true, unique: true
    },
    title: {
      type: String, required: true
    },
    description: {
      type: String, required: true
    },
    price: {
      type: Number, required: true
    },
    thumbnail: {
      type: Array, required: true
    },
    code: {
      type: Number, required: true, unique: true
    },
    stock: {
      type: Number, required: true
    },
    status: {
      type: Boolean, default: true
    },
    deleted: {
      type: Boolean, default: false
    }
  },
  {
    timestamps: true
  }
)

export const productsModel = mongoose.model(productsCollection, productsSchema)