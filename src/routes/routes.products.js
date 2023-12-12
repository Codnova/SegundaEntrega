// Imports

import {Router} from 'express';
import ProductManagerMongo from '../dao/ProductManagerMongo.js';
import { io } from '../app.js';

// Definitions

let productManager = new ProductManagerMongo();
export const router = Router();

// Methods

router.get("/", async (req, res) => { // Get the complete list of products
  res.setHeader("Content-Type", "application/json"); // Set the header
  let products = await productManager.getProducts();
  let limit = parseInt(req.query.limit); // Get the limit query for products
  if (!limit) {
    res.status(200).json({ products });
  } else {
    data = products.slice(0, limit); // Modify the array to limit the results
    res.status(200).json({ products });
  }
});

router.get("/:id", async (req, res) => { // Get a product by its ID
  res.setHeader("Content-Type", "application/json"); // Set the header
  let id = req.params.id; // Must be Product ID from MongoDB
  if (!id) {
    return res.status(400).json({error: "The ID you entered is not a valid number"});
  }
  let result = await productManager.getProductById(id);
  if (!result) {
    res.status(400).json({error: "The product couldn't be found"});
  } else {
    res.status(200).json({ result });
  }
});

router.delete("/:id", async (req, res) => { // Delete a product by its ID
  res.setHeader("Content-Type", "application/json"); // Set the header
  let id = req.params.id; // Must be Product ID from MongoDB
  if (!id) {
    return res.status(404).json({error: "The ID you entered is not a valid number"});
  }
  let result = await productManager.deleteProduct(id);
  let updatedProducts = await productManager.getProducts();
  io.emit('newProduct', updatedProducts);
  if (!result) {
    res.status(400).json({error: "The product couldn't be found"});
  } else {
    res.status(200).json({status:'success', message:'Product removed successfully'})
  }
});

router.put("/:id", async (req, res) => { // Update a product by its ID
  res.setHeader("Content-Type", "application/json"); // Set the header
  let product = req.body // Get the information to be updated
  let id = req.params.id; // Must be Product ID from MongoDB
  if (!id) {
    return res.status(400).json({error: "The ID you entered is not a valid number"});
  }
  let result = await productManager.updateProduct(id, product);
  let updatedProducts = await productManager.getProducts();
  io.emit('newProduct', updatedProducts);
  if (!result) {
    res.status(404).json({error: "The product couldn't be found"});
  } else {
    res.status(200).json({status:'success', message:'Product updated successfully'})
  }
});

router.post('/', async (req, res)=> {
  res.setHeader("Content-Type", "application/json"); // Set the header
  let product = req.body;
  console.log(product)
  if (!product.title || !product.description || !product.price || !product.code || !product.stock) {
    return res.status(400).json({status: 'error', error: 'Incomplete data, make sure to enter all required fields'})
  } 
  try {
    await productManager.addProduct(product) // Send the product and destructure it in the target function
    let updatedProducts = await productManager.getProducts();
    io.emit('newProduct', updatedProducts);
    res.status(200).json({ status: 'success', message:'Product added successfully' });
  } catch (error) {
    res.status(400).json({status:'error', message: error.message});
  }
})