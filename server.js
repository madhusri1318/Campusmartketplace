// server.js

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');


const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const contactRoutes = require('./routes/contact');
const userRoutes = require('./routes/users');



const app = express();
app.use(cors());
app.use(express.json());

// Serve images statically
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);


const requestsRouter = require('./routes/requests');
app.use('/api/requests', requestsRouter);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});