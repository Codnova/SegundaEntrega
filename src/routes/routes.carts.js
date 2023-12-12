// Imports

import {Router} from 'express';
import CartManager from '../dao/CartManagerMongo.js';

// Definitions

let cartManager = new CartManager();
export const router = Router();

// Methods

router.get("/", async (req, res) => { // Get the complete list of carts
  res.setHeader("Content-Type", "application/json"); // Set the header
  let carts = await cartManager.getCarts();
  res.status(200).json({ carts });
});

router.get("/:cid", async (req, res) => { // Get a cart by its ID
  res.setHeader("Content-Type", "application/json"); // Set the header
  let id = req.params.cid; // The cartId MUST be the _id from MongoDB
  let result = await cartManager.getCartById(id);
  if (!result) {
    res.status(400).json({error: "The cart couldn't be found"});
  } else {
    res.status(200).json({ result });
  }
});

router.post("/:cid/product/:pid", async (req, res) => { // Adds a product to a cart by its ID
  res.setHeader("Content-Type", "application/json"); // Set the header
  let cartId  = req.params.cid; // The cartId MUST be the _id from MongoDB
  let productId = req.params.pid; //Product Id MUST be the _id from mongoDB
  let product = req.body; // The object product with its quantity
  if (productId != product.productId){
    return res.status(400).json({error: "The product Id in the URL must match the productId in the req.body"});
  }
  if (!cartId ||!productId) {
    return res.status(400).json({error: "The cart or product ID you entered is not a valid number"});
  }
  let result = await cartManager.addProductToCart(cartId, product)
  if (result){
    res.status(200).json({status:'success', message: "Cart created successfully"})
  } else {
    return res.status(400).json({status: 'error', error: "The cart couldn't be updated, make sure you entered the data correctly"})
  }
});

router.post("/", async (req,res) => { // Creates a new cart with products
  let products = req.body; // An array of objects carts
  if (!products) {
    return res.status(400).json({status: 'error', error: "Incomplete data, make sure specify the products to be added to the cart"})
  } else {
    let result = await cartManager.addCart(products);
    if (result) {
      res.status(200).json({status:'success', message: "Cart created successfully"})
    } else{
      return res.status(400).json({status: 'error', error: "The cart couldn't be created, make sure you entered the data correctly"})
    }
  }
})

router.delete("/:cid", async (req, res) => { 
  res.setHeader("Content-Type", "application/json"); 
  let cartId = req.params.cid; // Extract the cartId from the request parameters
  if (!cartId) { // The cartID Must be the MongoDB id
    return res.status(400).json({error: "Please provide a valid cart ID"});
  }
  let result = await cartManager.deleteCart(cartId);
  if (result) {
    // Successfully deleted the cart
    res.status(200).json({status: 'success', message: "Cart deleted successfully"});
  } else {
    // Failed to delete the cart (either not found or some other error)
    res.status(400).json({error: "The cart couldn't be found or deleted"});
  }
});