import ProductManagerMongo from "./ProductManagerMongo.js";
import {cartsModel} from "./models/carts.model.js"

const productManager = new ProductManagerMongo; 

export default class CartManagerMongo {

  async getCarts(){

    try {
      return await cartsModel.find({deleted:false}).populate('products.productId');
    } catch (error) {
      if (error) {
        console.log(error); // There aren't any products or there was an error
        return null;
      }
    }
  }

  async getCartById(id) { // Checks if a cart exists and returns the cart
    try {
      let cart = await cartsModel.findOne({_id:id}).populate('products.productId');
      if (!cart) {
        console.log('Cart with ID not found: ', id);
      }
      return cart; // Return the found cart
    } catch (error) {
      console.log('Error getting the cart with ID: ', id);
      throw new Error('Error getting the cart with ID: ', id);
    }
  }

  async getProductInCart(id) { // Checks if a product ID is already present in a cart
    try {
      if (!await productManager.checkProductById(productId)){
        return false
      }
      let productFound = await cartsModel.find({productid:id})
      if (productFound) {
        console.log("Product found in cart:", productFound);
        return true
      } else{
        console.log("Product not found")
        return false
      }
    } catch (error) {
      console.log(error.message);
      throw new Error("Error checking for products in the cart");
    }
  }

  async addCart({products}) { // Creates a new cart with products and adds it to the database
    try{
      for (let element of products) { // Checks that every product in the array is valid 
        if (!element.productId || !element.quantity) {
          return false
        } else {
          if(!await productManager.checkProductById(element.productId)){ // Checks that every product exists in the list of products before it can be added to the cart
            console.log(`The product with ID ${element.productId} doesn't exist so it cannot be added to the cart`)
            return false
          }
        }
      }  
      let carts = await cartsModel.find().lean(); // Get all carts (even deleted ones) so that the ID can be set properly
      console.log('Current carts in the DB: ', carts)
      let cartId = 1;
      if (carts.length > 0) {
        cartId = carts[carts.length - 1].cartId + 1;
      }
      let newCart = {
        cartId,
        products
      }
      console.log('New cart en addCart: ', newCart);
      let result = await cartsModel.create(newCart);
      console.log('Result of addCart', result);
      if (result) {
        console.log('Cart created successfully');
        return true
      } else {
        console.log('Error saving the cart to the DB');
        return false
      }
    } catch (error){
      console.log(error.message)
      console.log("Error creating the cart");
      throw new Error("Error creating the cart");
    }
  }

  async addProductToCart(cartId, { productId, quantity }) { // Adds a product to a cart. If the product is already in the cart, increase its quantity
    try {
      if (!cartId || !productId || !quantity || !await productManager.checkProductById(productId)) { // Check if the product ID is invalid or doesn't exist in the list of products
        console.log(' You entered invalid data, the product ID is incorrect or it does not exists in the product DB');
        return false;
      } else {
        let cartFound = await cartsModel.findOne({_id:cartId, deleted:false});
        if (!cartFound) {
          console.log("Cart not found");
          return false;
        }
        const productsIndex = cartFound.products.findIndex(product => product.productId.equals(productId)) // Finds and retrieves the index of the product we are going to update (if it exists)
        if (productsIndex === -1){
          console.log('The product does not exists in the cart, so it will be added');
          const newProduct = {productId: productId, quantity: quantity};
          let result = await cartsModel.findByIdAndUpdate(
            cartId,
            {$push: {products: newProduct}},
            {new:true}
          );
          console.log(result);
        } else {
          console.log('The product is in the cart, so its quantity will be updated');
          let newQuantity = quantity + cartFound.products[productsIndex].quantity
          let update = { $set: { [`products.${productsIndex}.quantity`]: newQuantity } };
          let result = await cartsModel.findByIdAndUpdate(
            cartId,
            update,
            {new:true}
          )
          console.log(result);
        }
        return true;
      }
    } catch (error) {
      console.log(error.message);
      throw new Error("Error updating the cart");
    }
  }

  async deleteCart(cartId) { // Deletes a cart from the DB from its ID
    try {
      let result = await cartsModel.deleteOne({_id:cartId});
      console.log(result);
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }
}