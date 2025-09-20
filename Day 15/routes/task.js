const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const router = express.Router();


router.get('/team/:teamId', auth, async (req, res) => {
const tasks = await Task.find({ team: req.params.teamId }).sort('order');
res.json(tasks);
});


router.post('/', auth, async (req, res) => {
const task = await Task.create(req.body);
// notify team
req.io.to(`team_${task.team}`).emit('taskCreated', task);
res.json(task);
});


router.put('/:id', auth, async (req, res) => {
const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
req.io.to(`team_${task.team}`).emit('taskUpdated', task);
res.json(task);
});


module.exports = router;