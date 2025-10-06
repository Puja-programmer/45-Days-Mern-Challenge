const mongoose = require('mongoose');
const { Schema } = mongoose;
const ExpSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  company: String,
  title: String,
  startDate: Date,
  endDate: Date,
  description: String
});
ExpSchema.index({ company: 'text', title: 'text', description: 'text' });
module.exports = mongoose.model('Experience', ExpSchema);