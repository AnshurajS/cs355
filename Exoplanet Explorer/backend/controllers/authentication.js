const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/User');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    if (await userModel.findByEmail(email)) {
        return res.status(400).json({ msg: 'Email already used' });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = { username, email, password: hash, favorites: [] };
    const created = await userModel.create(user);
    const token = jwt.sign({ id: created._id }, process.env.JWT_SECRET);
    res.json({ token });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
};

exports.profile = async (req, res) => {
    const user = await userModel.findById(req.userId);
    const { password, ...rest } = user;
    res.json(rest);
};