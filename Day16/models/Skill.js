const mongoose = require('mongoose');
const { Schema } = mongoose;
const SkillSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  level: String // e.g. Beginner, Intermediate, Expert
});
SkillSchema.index({ name: 'text' });
module.exports = mongoose.model('Skill', SkillSchema);