const mongoose = require('mongoose');
const { Schema } = mongoose;
const ProjectSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  description: String,
  skills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
  technologies: [{ type: Schema.Types.ObjectId, ref: 'Technology' }],
  startDate: Date,
  endDate: Date
}, { timestamps: true });

ProjectSchema.index({ title: 'text', description: 'text' });
module.exports = mongoose.model('Project', ProjectSchema);