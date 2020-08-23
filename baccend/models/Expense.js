const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema({
 name: { type: String, required: true },
 description: { type: String, required: true },
 date: { type: String, required: true },
 image: { type: String, required: true },
 price: { type: Number, required: true },
 category: { type: String, required: true },
 user: { type: String, required: true },
 dateCreated: { type: String }
})

module.exports = mongoose.model('Expense', expenseSchema)

//const { name, description, date ,price, category, user } = req.body;