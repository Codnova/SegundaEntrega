import {productsModel} from './models/products.model.js';

export default class ProductManagerMongo {

  async getProducts(limit=10, page=1, query={}, sort={}) { // Retrieves the products in the database
    try {
      //console.log(`Queries received in PRODUCT MANAGER: LIMIT: ${limit}, PAGE: ${page}, QUERY: ${query}, SORT: ${sort}`);
      let data = await productsModel.paginate(query ,{lean:true, limit:limit, page:page, sort: sort}) //productsModel.find({}).lean();
      return data
    } catch (error) {
      if (error) {
        console.log(error); // There aren't any products or there was an error
        return null;
      }
    }
  }

  async getProductsPaginate() { // Returns the products paginate data
    try {
      let data = await productsModel.paginate({},{lean:true}) //productsModel.find({}).lean();
      return data
    } catch (error) {
      if (error) {
        console.log(error); // There aren't any products or there was an error
        return null;
      }
    }
  }

  async getProductsSort(sortPrice) {
    try {
      let sort = 0;
      if (sortPrice === 'asc'){
        sort = 1;
      } else if (sortPrice === 'desc') {
        sort =-1;
      } else {
        console.log('The sort can only be asc or desc')
      }
      let data = await productsModel.find({}).sort({price:sort})
      console.log(data)
      return data
    } catch (error) {
      if (error) {
        console.log(error); // There aren't any products or there was an error
        return null;
      }
    }
  } 

  async addProduct({ title, description, price, thumbnail, code, stock, status=true, deleted=false}) { // Adds a product to the database
    try {
      if (!title || !description || !price || !code || !stock) { // List of required values
        console.log('All values are required');
        throw new Error('All values are required');
      }
      let products = await productsModel.find() // Get all products (even deleted ones) so that the ID can be set properly
      let id = 1;
      if (products.length > 0) {
        id = products[products.length - 1].id + 1;
      }
      let newProduct = {
        id,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        deleted
      };
      if (products.some((product) => product.code === newProduct.code)) {
        console.log(`Product code ${newProduct.title} already exists in the array`);
        throw new Error(`Product code ${newProduct.title} already exists in the array`);
      } else {
        let result = await productsModel.create(newProduct); // Saves the product to the DB
        if (result) {
          return true
        } else {
          console.log('Product not added');
          return false
        }
      }
    } catch (error) {
      console.log('Error adding the product', error);
      throw new Error('Error adding the product');
    }
  }

  async deleteProduct(id) {
    try {
      return await productsModel.deleteOne({_id:id})
      //( {deleted:false, _id:id}, {$set: {deleted: true}}) // Logically deletes the product
    } catch (error) {
      console.log(error)
    }
  }

  async getProductById(id) { // Checks if a product exists and returns the product
    try {
      let product = await productsModel.findOne({_id:id}).lean();
      if (!product) {
        console.log('Product with ID not found: ', id);
      }
      return product; // Return the found product
    } catch (error) {
      console.log('Error getting the product with ID: ', id);
      throw new Error('Error getting the product with ID: ', id);
    }
  }

  async checkProductById(id){ // Checks if a productId exists and returns true or false
    try {
      let product = await productsModel.findOne({_id:id}).lean();
      if (!product) {
        console.log('Product with ID not found: ', id);
        return false
      }
      return true; // Return the true if product is found
    } catch (error) {
      console.log(error.message)
      console.log('Error getting the product with ID: ', id);
      throw new Error('Error getting the product with ID: ', id);
    }
  }

  async updateProduct(id, object) { // Updates a product in the database
    try {
      const allowedProperties = [
        'title',
        'description',
        'price',
        'thumbnail',
        'code',
        'stock',
      ]; // Properties that are allowed for modification
      let productCodeExists = await productsModel.findOne({code:object.code});
      if(productCodeExists){
        console.log(`The Product code of ${object.title} already exists in the array`);
        return false
      } else {
        let updateObject = {}; // We create an update object with only the allowed properties
        for (let key of Object.keys(object)) {
          if (allowedProperties.includes(key)) {
            updateObject[key] = object[key];
          }
        }
        let updatedProducts = await productsModel.findOneAndUpdate({_id:id}, updateObject, {new:true});
        if (!updatedProducts) {
          console.log('The product could not be updated')
          return false
        } else {
          console.log(`Product ${updatedProducts.title} has been updated`);
          return true;
        }
      }
    } catch (error) {
      console.log('Product with ID not updated: ', id);
      throw new Error('Product with ID not updated: ', id);
    }
  }
}