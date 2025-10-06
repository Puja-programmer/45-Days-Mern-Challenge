const mongoose = require(`mongoose`);
const TeamSchema = new mongoose.Schema({
name: String,
owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
members:[{ type:mongoose.Schema.Types.ObjectId, ref: 'User'}]
});
module.exports = mongoose.model('Team', TeamSchema);