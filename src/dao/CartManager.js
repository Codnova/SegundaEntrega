import fs from 'fs/promises';
import ProductManager from './ProductManager.js';
import __dirname from '../utils.js';
import {join} from 'path';

const fileName = join(__dirname, "/dao/products.json")
const productManager = new ProductManager(fileName);

export default class CartManager {
  
  constructor(filePath) {
    this.path = filePath;
  }

  async getCarts() { // Returns a list of all the Carts in the database
    try {
      let data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        // File doesn't exist
        return [];
      }
      throw new Error("Error loading the Cart's file");
    }
  }

  async getCartById(id){ // Returns the cart by its ID
    try {
      let carts = await this.getCarts();
      let cartFound = carts.find( cart => cart.id ===id );
      if (!cartFound) {
        console.log("Cart with ID not found: ", id);
        return false
      }
      return cartFound 
    } catch (error) {
      console.log(error.message)
      console.log("Error getting the cart with ID: ", id);
      throw new Error("Error getting the cart with ID: ", id);
    }
  }

  async getProductInCart(productId){ // Checks if a product ID is already present in a cart
    try {
      if (!await productManager.checkProductById(productId)){
        return false
      }
      let carts = await this.getCarts();
      for (let cart of carts) {
        let productsFound = cart.find (cart => cart.products.some((product)=> product.product === productId))
        if (productsFound) {
          console.log("Product found in cart:", productsFound);
          return true
        } else{
          console.log("Product not found")
          return false
        }
      }
      
    } catch (error) {
      console.log(error.message);
      throw new Error("Error checking for products in the cart");
    }
  }

  async addProductToCart(cartId, { product, quantity }) { // Adds a product to a cart. If the product is already in the cart, increase its quantity
    try {
      if (!product || !await productManager.checkProductById(product)) { // Check if the product ID is invalid or doesn't exist in the list of products
        console.log("The product ID is incorrect, please make sure to enter a valid one");
        return false;
      } else {
        let carts = await this.getCarts();
        let cartIndex = carts.findIndex((cart) => cart.id === cartId); // Get the index in the array of carts
        if (cartIndex === -1) {
          console.log("Cart not found");
          return false;
        }
        let existingProduct = carts[cartIndex].products.find((item) => item.product === product); // Check if the product already exists in the cart's products array
        if (existingProduct) {
          existingProduct.quantity += quantity; // If the product already exists in the cart, increment the quantity
        } else {
          carts[cartIndex].products.push({ // If the product doesn't exist, add it to the cart's products array
            product,
            quantity,
          });
        }
        // Save the updated cart back to the file
        await fs.writeFile(this.path, JSON.stringify(carts));
        return true;
      }
    } catch (error) {
      console.log(error.message);
      throw new Error("Error updating the cart");
    }
  }

  async addCart(products){ // Creates a new cart with products and adds it to the database
    try{
      for (let element of products) { // Checks that every product in the array is valid 
        if (!element.product || !element.quantity) {
          return false
        } else {
          if(!await productManager.checkProductById(element.product)){ //Checks that every product exists in the list of products before it can be added to the cart
            console.log(`The product with ID ${element.product} doesn't exist so it cannot be added to the cart`)
            return false
          }
        }
      }
      let carts = await this.getCarts();
      let id = 1;
      if (carts.length > 0) {
        id = carts[carts.length - 1].id + 1;
      }
      let newCart = {
        id,
        products
      }
      carts.push(newCart)
      await fs.writeFile(this.path, JSON.stringify(carts));
      return true
    } catch (error){
      console.log(error.message)
      console.log("Error creating the cart");
      throw new Error("Error creating the cart");
    }
  }
}
