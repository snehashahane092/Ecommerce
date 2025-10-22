const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Create a new order (checkout)
router.post('/', protect, async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice } = req.body;
    if (!orderItems || orderItems.length === 0) {
      console.log('Order Creation: No order items');
      return res.status(400).json({ message: 'No order items' });
    }
    console.log('Order Creation: User:', req.user ? req.user._id : null, 'orderItems:', orderItems.length);
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });
    const createdOrder = await order.save();
    console.log('Order Created:', createdOrder._id);
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Order Creation Error:', error);
    res.status(500).json({ message: error.message, where: 'order create' });
  }
});

// Get logged-in user's orders (with robust user id matching)
router.get('/myorders', protect, async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const userId = req.user._id.toString();
    const allOrders = await Order.find();
    const userOrders = allOrders.filter(
      order => order.user && order.user.toString() === userId
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(userOrders);
  } catch (error) {
    res.status(500).json({ message: error.message, where: 'get myorders' });
  }
});

// Get a single order by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(order);
  } catch (error) {
    console.error('Order By ID Fetch Error:', error);
    res.status(500).json({ message: error.message, where: 'get order by id' });
  }
});

module.exports = router;
