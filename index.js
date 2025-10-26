const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Veritabanı bağlantısını içe aktar
const db = require('./src/config/db');

// Sample route
app.get('/', (req, res) => {
  res.send('Hello World!');
});
const productRoutes = require('./src/routes/product.route');
app.use('/product', productRoutes.router);

app.get('/test', (req, res) => {
  res.send(productRoutes.test);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});