const express = require('express');
const authorize = require('../middlewares/authorize');
const { Order } = require('../models/orders');
const router = express.Router();

const newOrder = async (req, res) => {
    const order = new Order(req.body);

    try {
        await order.save();
        return res.status(201).send("Order placed successfully!");
    } catch (error) {
        return res.status(400).send("Something went wrong! Please try again.");
    }
}

const orderList = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).sort({ orderTime: -1 });
        res.send(orders);
    } catch (error) {
        return res.status(400).send("Something went wrong! Please try again.");
    }
}

router.route('/')
    .get(authorize, orderList)
    .post(authorize, newOrder);

module.exports = router;