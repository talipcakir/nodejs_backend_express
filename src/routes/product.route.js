const express = require('express');
const router = express();
const db = require('../config/db');

router.get('/', (req, res) => {
  res.send('Welcome to the Product API');
});

router.get('/products', (req, res) => {
  db.query(`SELECT * FROM products`, (err, results) => {
    res.json(results);
  });
});

router.get('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  db.query(`SELECT * FROM products where id = ` + productId, (err,result) => {

    // Ürün bulunamazsa 404 döndür
    if (result.length === 0) {
      return res.status(404).send('Product not found');
    }

    res.json(result);
  });
});

router.post('/products', (req, res) => {
  const newProduct = req.body;
  //title, price, description, category, image
  console.log(JSON.stringify(newProduct));

  db.query(
    'INSERT INTO products (title, price, description, category, image) VALUES (?, ?, ?, ?, ?)',
    [newProduct.title, newProduct.price, newProduct.description, newProduct.category, newProduct.image],
    (err, result) => {
      newProduct.id = result.insertId;
      res.status(201).json(newProduct);
    }
  );
  
});

router.put('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const updatedProduct = req.body;

  db.query(
    'UPDATE products SET title = ?, price = ?, description = ?, category = ?, image = ? WHERE id = ?',
    [updatedProduct.title, updatedProduct.price, updatedProduct.description, updatedProduct.category, updatedProduct.image, productId],
    (err, result) => {
      if (err) {
        return res.status(500).send('Error updating product');
      }
    }
  );

  res.json({ id: productId, ...updatedProduct });
});

router.delete('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  // In a real application, you would delete the product from the database here
  res.status(204).send();
});

const test = 'this is a test';

module.exports = {router, test};