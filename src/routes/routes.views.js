// Imports

import { Router } from 'express';
import __dirname from '../utils.js'; //Importamos utils para poder trabvajar con rutas absolutas
import ProductManagerMongo from '../dao/ProductManagerMongo.js';

// Definitions

export const router = Router();
const productManager = new ProductManagerMongo()

// Methods


router.get('/', async (req,res) => {

  try {
    let data = await productManager.getProducts(); // Retrieves the products from the DB
    console.log("data que viene de DB: ", data)
    res.status(200).render('home' , {data})

  } catch (error) {
        res.setHeader('Content-Type','application/json');
        console.log(error.message)
        return res.status(400).json({error:`error`});
  }
})

router.get('/realtimeproducts', async (req,res) => {

  try {  
    let data = await productManager.getProducts(); // Retrieves the products from the DB
    res.status(200).render('realTimeProducts' , {data})

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