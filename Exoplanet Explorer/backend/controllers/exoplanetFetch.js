const fetch = require('node-fetch');
const userModel = require('../models/User');

exports.fetchPlanets = async (req, res) => {
    try {
        const response = await fetch(process.env.NASA_API_URL);
        const data = await response.json();
        res.json(data);
    } catch {
        res.status(500).json({ msg: 'Fetch error' });
    }
};

exports.getFavorites = async (req, res) => {
    const user = await userModel.findById(req.userId);
    res.json(user.favorites);
};

exports.addFavorite = async (req, res) => {
    const { pl_name, pl_masse, pl_rade } = req.body;
    const user = await userModel.findById(req.userId);

    if (user.favorites.some(f => f.pl_name === pl_name)) {
        return res.status(400).json({ msg: 'Planet already in favorites' });
    }

    const favs = [...user.favorites, { pl_name, pl_masse, pl_rade }];
    await userModel.updateFavorites(req.userId, favs);
    res.json(favs);
};

exports.removeFavorite = async (req, res) => {
    const { pl_name } = req.params;
    const user = await userModel.findById(req.userId);
    const favs = user.favorites.filter(f => f.pl_name !== pl_name);
    await userModel.updateFavorites(req.userId, favs);
    res.json(favs);
};