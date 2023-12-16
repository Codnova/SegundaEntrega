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
  if (!carts) {
    res.status(400).json({error: 'Could not fetch carts'});
  } else {
    res.status(200).json({ carts });
  }
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
  if (!cartId || !productId) {
    return res.status(400).json({error: "The cart or product ID you entered is not a valid number"});
  }
  let result = await cartManager.addProductToCart(cartId, product)
  if (result){
    res.status(200).json({status:'success', message: "Product added to the cart successfully"})
  } else {
    return res.status(400).json({status: 'error', error: "The cart couldn't be updated, make sure you entered the data correctly"})
  }
}); //TODO Decrease stock of the product

router.post("/", async (req,res) => { // Creates a new cart with products
  let products = req.body; // An array of product objects to be added to the cart
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
}) //TODO Decrease stock of the product

router.delete("/:cid/product/:pid", async (req, res) => { // Deletes a product from a cart by its ID
  res.setHeader("Content-Type", "application/json"); // Set the header
  let cartId  = req.params.cid; // The cartId MUST be the _id from MongoDB
  let productId = req.params.pid; //Product Id MUST be the _id from mongoDB
  if (!cartId || !productId) {
    return res.status(400).json({error: "The cart or product ID you entered is not a valid number"});
  }
  let result = await cartManager.deleteProductFromCart(cartId, productId)
  if (result){
    res.status(200).json({status:'success', message: "Product deleted from cart successfully"})
  } else {
    return res.status(400).json({status: 'error', error: "The product couldn't be deleted from the cart"})
  }
}); //TODO Decrease stock of the product

router.delete("/:cid", async (req, res) => { // Deletes all the products form a cart
  res.setHeader("Content-Type", "application/json"); 
  let cartId = req.params.cid; // Extract the cartId from the request parameters
  if (!cartId) { // The cartID Must be the MongoDB id
    return res.status(400).json({error: "Please provide a valid cart ID"});
  }
  let result = await cartManager.emptyCart(cartId);
  if (result) { // Successfully deleted the cart
    res.status(200).json({status: 'success', message: "Cart deleted successfully"});
  } else {// Failed to empty the cart (either not found or some other error)
    res.status(400).json({error: "The cart couldn't be found or emptied"});
  }
}); //TODO Decrease stock of the product

router.put('/:cid', async (req, res) => { // Updates the entire cart with the products sent via body
  res.setHeader("Content-Type", "application/json"); 
  let cartId = req.params.cid; // Extract the cartId from the request parameters
  let products = req.body; // An array of product objects to be added to the cart
  if (!products) {
    return res.status(400).json({status: 'error', error: "Incomplete data, make sure specify the products to be added to the cart"})
  } else {
    let result = await cartManager.updateCart(cartId, products);
    if (result) {
      res.status(200).json({status:'success', message: "Cart updated successfully"})
    } else{
      return res.status(400).json({status: 'error', error: "The cart couldn't be updated, make sure you entered the data correctly"})
    }
  }
}); //TODO Decrease stock of the product

router.put('/:cid/product/:pid', async (req, res) => { // Updates the quantity sent via body of a product from a cart 
  res.setHeader("Content-Type", "application/json"); 
  let cartId = req.params.cid; // Extract the cartId from the request parameters
  let productId = req.params.pid; //Product Id MUST be the _id from mongoDB
  let {quantity} = req.body; // The quantity of the product we will update
  quantity = parseInt(quantity); // Convert to integer
  if (!cartId || !productId || !quantity || !Number.isInteger(quantity)) {
    return res.status(400).json({status: 'error', error: "Incomplete data, make sure specify the quantity of the product to be updated"})
  } else {
    let result = await cartManager.updateProductQuantityCart(cartId, productId, quantity);
    if (result) {
      res.status(200).json({status:'success', message: "Product quantity in Cart updated successfully"})
    } else{
      return res.status(400).json({status: 'error', error: "The product quantity in Cart couldn't be updated, make sure you entered the data correctly"})
    }
  }
}); //TODO Decrease stock of the product

/* router.delete("/:cid", async (req, res) => { // Deletes an entire cart by its ID
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
}); */