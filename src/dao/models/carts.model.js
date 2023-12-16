import mongoose from "mongoose";

const cartsCollection = 'carts'
const cartsSchema = new mongoose.Schema(
  {
    cartId: { // Do not use this ID, use MongoDB _id
      type: Number,
      unique: true
    },
    products: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'products',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
      }
    }],
    deleted: {
      type: Boolean, default: false
    }
  },
  {
    timestamps: true
  }
  
)

export const cartsModel = mongoose.model(cartsCollection, cartsSchema)