const mongoose = require('mongoose');
const { Schema } = mongoose;
const TechSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  name: String
});
TechSchema.index({ name: 'text' });
module.exports = mongoose.model('Technology', TechSchema);