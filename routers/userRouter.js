const express = require('express');
const { User, validate } = require('../models/users');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const router = express.Router();

const newUser = async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered!");

    user = new User(_.pick(req.body, ['email', 'password']));

    user.password = await bcrypt.hash(user.password, 10);

    const token = user.generateJWT();

    const result = await user.save();

    return res.status(201).send({
        token: token,
        data: _.pick(result, ['_id', 'email'])
    });
}

const authUser = async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Your email or password is invalid!");

    const validUser = await bcrypt.compare(req.body.password, user.password);
    if (!validUser) return res.status(400).send("Your email or password is invalid!");
    
    const token = user.generateJWT();

    res.send({
        token: token,
        data: _.pick(user, ['_id', 'email'])
    });
}

router.route('/')
    .post(newUser);

router.route('/auth')
    .post(authUser);

module.exports = router;