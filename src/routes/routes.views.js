// Imports

import { Router } from 'express';
import __dirname from '../utils.js'; //Importamos utils para poder trabvajar con rutas absolutas
import ProductManagerMongo from '../dao/ProductManagerMongo.js';
import CartManagerMongo from '../dao/CartManagerMongo.js';

// Definitions

export const router = Router();
const productManager = new ProductManagerMongo();
const cartManager = new CartManagerMongo();

// Methods


router.get('/', async (req,res) => {

  try {
    res.status(200).render('home')

  } catch (error) {
        res.setHeader('Content-Type','application/json');
        console.log(error.message)
        return res.status(400).json({error:`error`});
  }
})

router.get('/products', async (req,res) => {

  try {
    let {limit=10, page=1, sort, query} = req.query;
    console.log(`Queries received in view router LIMIT: ${limit}, PAGE: ${page}, QUERY: ${query}, SORT: ${sort}`);
    let products = await productManager.getProducts( limit, page, query, sort); // Fetches the paginate data of all products
    let {totalPages, hasNextPage, hasPrevPage, prevPage, nextPage} = products
    console.log('Pagination values from DB: ', totalPages, hasNextPage, hasPrevPage, prevPage, nextPage); 
    res.status(200).render('products' , {
      data: products.docs,
      totalPages, hasNextPage, hasPrevPage, prevPage, nextPage, limit, page, sort, query
    })

  } catch (error) {
        res.setHeader('Content-Type','application/json');
        console.log(error.message)
        return res.status(400).json({error:`error`});
  }
})

router.get('/realtimeproducts', async (req,res) => {

  try {  
    let data = await productManager.getProducts(); // Retrieves the products from the DB
    res.status(200).render('realTimeProducts' , {data: data.docs})

  } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`error`});
  }
})

router.get('/chatapp', async (req,res) => {

  try {  
    res.status(200).render('chat') // Renders the chat app

  } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`error`});
  }
})

router.get('/carts/:cid', async (req,res) => {
  let cartId = req.params.cid;
  try {
    let data = await cartManager.getCartById(cartId);
    if (!data) {
      return res.status(404).render('error', { message: "Cart not found" });
    }
    data.products.forEach(product => {
      console.log(product.productId);
    });

    //console.log(data)
    res.status(200).render('carts', {
      products: data.products,
      cartId: cartId
    }) // Renders the carts view

  } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`error`});
  }
})