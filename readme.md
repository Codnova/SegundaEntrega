# CoderHouse eCommerce Backend Project

A simple yet robust backend server built with Node.js, Socket.io, and Express.js, demonstrating a RESTful API for product and cart management. 

## Getting Started

Clone the repository and navigate to the project directory. Install the necessary dependencies using npm:

```bash
git clone <https://github.com/Codnova/My-First-ExpressJS-Server.git>
cd <project-directory>
npm install
```

## Running the server

Start the server by executing the following command:

```bash
node ./app.js
```

The server will start and listen on port 8080.

## API Endpoints

### Products
- **GET** `/api/products/` - Fetch all products.
  - Query Parameters: `?limit=<number>`
- **GET** `/api/products/:pid` - Fetch a single product by its ID.
- **POST** `/api/products/` - Add a new product.
  - Body Parameters:
    - title (String)
    - description (String)
    - code (String)
    - price (Number)
    - status (Boolean, default: true)
    - stock (Number)
    - category (String)
    - thumbnails (Array of Strings, optional)
- **PUT** `/api/products/:pid` - Update an existing product by its ID.
  - Body Parameters: Any of the fields from POST excluding id.
- **DELETE** `/api/products/:pid` - Delete a product by its ID.

### Carts
- **POST** `/api/carts/` - Create a new cart.
  - Body Parameters: None
- **GET** `/api/carts/:cid` - Fetch the products in a cart by cart ID.
- **POST** `/api/carts/:cid/product/:pid` - Add a product to a cart.
  - Body Parameters:
    - quantity (Number)

## Testing the API

Use Postman or your preferred HTTP client to test the API endpoints.

## Data Persistence

Data is persisted in the file system with `products.json` and `carts.json` files.

## Built With
- Node.js
- Express.js
- Socket.io