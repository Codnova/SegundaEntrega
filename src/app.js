// Imports

import express from 'express';
import {engine} from 'express-handlebars';
import {join} from 'path';
import {router as viewsRouter} from './routes/routes.views.js';
import {router as productRouter} from './routes/routes.products.js';
import {router as cartRouter} from './routes/routes.carts.js';
import {Server} from 'socket.io';
import { messagesModel } from './dao/models/messages.model.js';
import __dirname from './utils.js'; 
import mongoose from 'mongoose';


// Definitions

const PORT = 3000; 
const viewFolder = join(__dirname, '/views');
const publicFolder = join(__dirname, '/public');
const app = express();
const server = app.listen(PORT, ()=> console.log('Server online on Port: ', PORT));
export const io = new Server (server);

// Methods

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', viewFolder);
app.use(express.static(publicFolder));
app.use('/', viewsRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter)

async function connectDB() {
  try {
    await mongoose.connect('mongodb+srv://codiox:<INSERTECLAVE>@ecommerce.76nmmgq.mongodb.net/?retryWrites=true&w=majority', {dbName:'ecommerce'})
    console.log('DB Online');
  } catch (error) {
    console.log(error)
  }
}

async function getChats() { // Load the chats form DB
  try {
    let result = await messagesModel.find();
    return result
  } catch (error) {
    console.log('Error loading the chats: ', error);
  }
}

async function saveChats({sender, message}) { // Save chats to DB
  try {
    let result = await messagesModel.create({email:sender, message: message});
    return result
  } catch (error) {
    console.log('Error saving the chats: ', error);
  }

}

// Init

connectDB();

let users = [];

io.on("connection", (socket) => {
  console.log(`New socket connected with ID: ${socket.id}`)
  socket.on("login", async (name) => {
    console.log("The user with the following ID has logged in: ", name);
    socket.broadcast.emit("newUser", name); // We broadcast to everyone (except the sender), that a user has logged in
    users.push({ name, id: socket.id });
    let messagesDB = await getChats(); // Get the messages from MongoDB
    console.log('Messages in the DB: ', messagesDB)
    socket.emit("getMessages", messagesDB); // Loads all the messages stored in memory to the new user
  });

  socket.on("message", async (messageObj) => {
    console.log(
      `The user ${messageObj.sender} sent the following message: ${messageObj.message}`
    );
    io.emit("newMessage", messageObj); // We send the message to everyone connected to the server
    await saveChats(messageObj); // Saves the message to the DB
  });

  socket.on("disconnect", () => {
    // If a user disconnects, we let everyone know
    let disconnectedUser = users.find((user) => user.id === socket.id);
    if (disconnectedUser) {
      io.emit("userDisconnect", disconnectedUser.name);
    }
  });
});
