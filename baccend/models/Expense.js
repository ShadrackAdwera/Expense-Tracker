const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema({
 name: { type: String, required: true },
 description: { type: String, required: true },
 date: { type: String, required: true },
 image: { type: String, required: true },
 price: { type: Number, required: true },
 category: { type: mongoose.Types.ObjectId, required: true, ref:'Category' },
 user: {type: mongoose.Types.ObjectId, required: true, ref:'User'},
 dateCreated: { type: String }
})

module.exports = mongoose.model('Expense', expenseSchema)
