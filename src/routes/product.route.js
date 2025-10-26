const express = require('express');
const router = express();

router.get('/products', (req, res) => {
  res.json([
    { id: 1, name: 'Product A' },
    { id: 2, name: 'Product B' },
  ]);
});

router.get('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const products = [
    { id: 1, name: 'Product A' },
    { id: 2, name: 'Product B' },
  ];
  const product = products.find(p => p.id === productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).send('Product not found');
  }
});

router.post('/products', (req, res) => {
  const newProduct = req.body;
  // In a real application, you would save the product to the database here
  res.status(201).json(newProduct);
});

router.put('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const updatedProduct = req.body;
  // In a real application, you would update the product in the database here
  res.json({ id: productId, ...updatedProduct });
});

router.delete('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  // In a real application, you would delete the product from the database here
  res.status(204).send();
});

const test = 'this is a test';

module.exports = {router, test};