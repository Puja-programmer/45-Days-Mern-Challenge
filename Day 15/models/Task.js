const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({
team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
title: String,
description: String,
status: { type: String, enum: ['todo','in-progress','done'], default: 'todo' },
order: Number,
assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
module.exports = mongoose.model('Task', TaskSchema);