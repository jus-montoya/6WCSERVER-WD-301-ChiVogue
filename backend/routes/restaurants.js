const express = require('express');
const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant');
const router = express.Router();
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const validId = (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid restaurant id' });
    next();
};

router.get('/', async (req, res) => {
    try {
        const { search = '', field = 'all', borough = '', cuisine = '', sort = 'rating' } = req.query;
        const limit = Math.min(parseInt(req.query.limit) || 8, 200);
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const filter = {};
        if (search.trim()) {
            const term = new RegExp(escapeRegex(search.trim()), 'i');
            filter[field === 'name' ? 'name' : field === 'cuisine' ? 'cuisine' : field === 'borough' ? 'borough' : '$or'] = field === 'all' ? [{ name: term }, { cuisine: term }, { borough: term }] : term;
        }
        if (borough) filter.borough = borough;
        if (cuisine) filter.cuisine = cuisine;
        const ordering = sort === 'name' ? { name: 1 } : { rating: -1, name: 1 };
        const [items, total] = await Promise.all([
            Restaurant.find(filter).sort(ordering).skip((page - 1) * limit).limit(limit).lean(),
            Restaurant.countDocuments(filter)
        ]);
        res.json({ items, total, page, pages: Math.max(Math.ceil(total / limit), 1) });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/summary/boroughs', async (req, res) => {
    try { res.json(await Restaurant.aggregate([{ $group: { _id: '$borough', count: { $sum: 1 } } }, { $sort: { count: -1 } }])); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/summary/cuisines', async (req, res) => {
    try {
        const stages = [{ $group: { _id: '$cuisine', count: { $sum: 1 }, averageRating: { $avg: '$rating' } } }, { $sort: { count: -1, _id: 1 } }];
        res.json(await Restaurant.aggregate(stages));
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/best', async (req, res) => {
    try {
        const min = Number(req.query.min);
        const threshold = Number.isNaN(min) ? 0 : min;
        res.json(await Restaurant.aggregate([{ $match: { rating: { $gte: threshold } } }, { $sort: { rating: -1, name: 1 } }, { $limit: 50 }]));
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', validId, async (req, res) => {
    try { const doc = await Restaurant.findById(req.params.id); if (!doc) return res.status(404).json({ message: 'Restaurant not found' }); res.json(doc); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', async (req, res) => {
    try { const { name, cuisine, borough, rating, image = '', address = {} } = req.body; const doc = await Restaurant.create({ name, cuisine, borough, rating, image, address, grades: [] }); res.status(201).json(doc); }
    catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', validId, async (req, res) => {
    try {
        const doc = await Restaurant.findById(req.params.id);
        if (!doc) return res.status(404).json({ message: 'Restaurant not found' });
        ['name', 'cuisine', 'borough', 'rating', 'image'].forEach(k => { if (req.body[k] !== undefined) doc[k] = req.body[k]; });
        if (req.body.address) ['building', 'street', 'zipcode'].forEach(k => { if (req.body.address[k] !== undefined) doc.set(`address.${k}`, req.body.address[k]); });
        await doc.save(); res.json(doc);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', validId, async (req, res) => {
    try { const doc = await Restaurant.findByIdAndDelete(req.params.id); if (!doc) return res.status(404).json({ message: 'Restaurant not found' }); res.json({ message: 'Restaurant deleted' }); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
