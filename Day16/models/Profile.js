const mongoose = require('mongoose');
const { Schema } = mongoose;
const ProfileSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  headline: String,
  summary: String,
  location: String
});
ProfileSchema.index({ headline: 'text', summary: 'text' });
module.exports = mongoose.model('Profile', ProfileSchema);