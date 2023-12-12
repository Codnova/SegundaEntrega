import fs from 'fs/promises';

export default class ProductManager {

  constructor(filePath) {
    this.path = filePath;
  }

  async getProducts() { // Retrieves the products in the database
    try {
      let data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        // File doesn't exist
        return [];
      }
      throw new Error("Error loading the Products file");
    }
  }

  async addProduct({ title, description, price, thumbnail, code, stock, status=true}) { // Adds a product to the database
    try {
      if (!title || !description || !price || !code || !stock) { // List of required values
        console.log("All values are required");
        throw new Error("All values are required");
      }
      let products = await this.getProducts();
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
      };
      if (products.some((product) => product.code === newProduct.code)) {
        console.log(`Product code ${newProduct.title} already exists in the array`);
        throw new Error(`Product code ${newProduct.title} already exists in the array`);
      } else {
        products.push(newProduct);
        await fs.writeFile(this.path, JSON.stringify(products));
      }
    } catch (error) {
      console.log("Error adding the product", error);
      throw new Error("Error adding the product");
    }
  }

  async getProductById(id) { // Returns the product if it exists
    try {
      let products = await this.getProducts();
      let productFound = products.find((product) => product.id === id);
      if (!productFound) {
        console.log("Product with ID not found: ", id);
      }
      return productFound; // Return the found product
    } catch (error) {
      console.log("Error getting the product with ID: ", id);
      throw new Error("Error getting the product with ID: ", id);
    }
  }

  async checkProductById(id){ // Checks if a productId exists and returns true or false
    try {
      let products = await this.getProducts();
      let productFound = products.find((product) => product.id === id);
      if (!productFound) {
        console.log("Product with ID not found: ", id);
        return false
      }
      return true; // Return the true if product is found
    } catch (error) {
      console.log(error.message)
      console.log("Error getting the product with ID: ", id);
      throw new Error("Error getting the product with ID: ", id);
    }
  }

  async removeProduct(id) { // Removes a product from the database
    try {
      let products = await this.getProducts();
      let index = products.findIndex((product) => product.id === id);
      if (index === -1) {
        console.log("Product not found in removeProduct");
        return;
      } else {
        console.log(`Product ${products[index].title} has been deleted`);
        products.splice(index, 1);
        await fs.writeFile(this.path, JSON.stringify(products, null, 5)); // Save the changes to the file
        return true;
      }
    } catch (error) {
      console.log("Error deleting the product with ID: ", id);
      throw new Error("Error deleting the product with ID: ", id);
    }
  }

  async updateProduct(id, object) { // Updates a product in the database
    try {
      const allowedProperties = [
        "title",
        "description",
        "price",
        "thumbnail",
        "code",
        "stock",
      ]; // Properties that are allowed for modification
      let products = await this.getProducts();
      let index = products.findIndex((product) => product.id === id);
      if (index === -1) {
        console.log("Product not found in updateProduct");
        return false;
      } else {
        if (products.some((product) => product.code === object.code)) {
          console.log(`Product code ${object.title} already exists in the array`);
          return false;
        } else {
          for (let key of Object.keys(object)) {
            // If the properties of the object to update are in the list, the values are replaced
            if (allowedProperties.includes(key)) {
              products[index][key] = object[key];
            }
          }
          console.log(`Product ${products[index].title} has been updated`);
          await fs.writeFile(this.path, JSON.stringify(products, null, 5)); // Save the changes to the file
          return true;
        }
      }
    } catch (error) {
      console.log("Product with ID not updated: ", id);
      throw new Error("Product with ID not updated: ", id);
    }
  }
}

