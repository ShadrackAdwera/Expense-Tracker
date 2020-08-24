const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  expenses: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Expense' }],
  user: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
});

module.exports = mongoose.model('Category', categorySchema);
