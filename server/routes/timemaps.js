const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Timemap = require('../models/Timemap');

// All routes in this file will be protected by the auth middleware
router.use(authMiddleware);

// GET all timemaps for the logged-in user
router.get('/', async (req, res) => {
  try {
    const timemaps = await Timemap.find({ userId: req.user.uid });
    res.json(timemaps);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST a new timemap for the logged-in user
router.post('/', async (req, res) => {
  try {
    const { name, nodes } = req.body;
    const newTimemap = new Timemap({
      userId: req.user.uid,
      name,
      nodes,
    });
    const timemap = await newTimemap.save();
    res.status(201).json(timemap);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST to fork a timemap
router.post('/:id/fork', async (req, res) => {
  try {
    const originalTimemap = await Timemap.findById(req.params.id);
    if (!originalTimemap) {
      return res.status(404).json({ msg: 'Timemap not found' });
    }

    const newTimemap = new Timemap({
      userId: req.user.uid,
      name: `Fork of ${originalTimemap.name}`,
      nodes: originalTimemap.nodes,
      forkedFrom: originalTimemap._id,
    });

    const timemap = await newTimemap.save();
    res.status(201).json(timemap);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
