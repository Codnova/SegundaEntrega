import mongoose from "mongoose";

const cartsCollection = 'carts'
const cartsSchema = new mongoose.Schema(
  {
    cartId: {
      type: Number,
      unique: true // Ensures that each cart has a unique ID
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