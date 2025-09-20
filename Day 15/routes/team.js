const express = require('express');
const Team = require('../models/Team');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();


router.post('/', auth, async (req, res) => {
const t = await Team.create({ name: req.body.name, owner: req.user.id, members: [req.user.id] });
await User.findByIdAndUpdate(req.user.id, { $push: { teams: t._id } });
res.json(t);
});


router.get('/', auth, async (req, res) => {
const teams = await Team.find({ members: req.user.id });
res.json(teams);
});


module.exports = router;