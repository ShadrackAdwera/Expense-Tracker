const { validationResult } = require('express-validator')
const { v4:uuid } = require('uuid')
const HttpError = require('../models/http-error')

let DUMMY_CATEGORIES = [
    {
        id: uuid(),
        name: 'Shopping',
        description: 'Supermarket, clothing, shoes etc',
        total: 5500,
        expenses : [ uuid(), uuid()]
    },
    {
        id: uuid(),
        name: 'Bills',
        description: 'Electricity, Water, Internet, Garbage fee etc',
        total: 1500,
        expenses : [ uuid(), uuid()]
    },
    {
        id: uuid(),
        name: 'Rent',
        description: 'Monthly Rent',
        total: 1600,
        expenses : [ uuid(), uuid()]
    },
    {
        id: uuid(),
        name: 'Outings',
        description: 'Food, Drinx na Mayenx',
        total: 15000,
        expenses : [ uuid(), uuid()]
    }
]

//CREATE
const createCategory = (req,res,next) => {
    const error = validationResult(req)
    if(!error.isEmpty()) {
        return next(new HttpError('Provide all the required fields',422))
    }
    const { name, description, expenses } = req.body

    const createdCategory = {
        id: uuid(),
        name,description, expenses, total: 5000
    }
    DUMMY_CATEGORIES.unshift(createdCategory)
    res.status(200).json({message:'Successfully Create Category', category: createdCategory})
}

//READ
const getAllCategories = (req,res,next) => {
    res.status(200).json({totalCategories: DUMMY_CATEGORIES.length, categories: DUMMY_CATEGORIES})
}

const getCategoryById = (req,res,next) => {
    const categoryId = req.params.id
    const foundCategory = DUMMY_CATEGORIES.find(category=>category.id===categoryId)
    if(!foundCategory) {
        return next(new HttpError('Category does not exist', 404))
    }
    res.status(200).json({category: foundCategory})
}

//UPDATE
const updateCategory = (req,res,next) => {
    const categoryId = req.params.id
    const { name, description } = req.body
    const foundCategory = DUMMY_CATEGORIES.find(category=>category.id===categoryId)
    const foundIndex = DUMMY_CATEGORIES.findIndex(category=>category.id===categoryId)
    if(!foundCategory) {
        return next(new HttpError('Category does not exist', 404))
    }
    foundCategory.name = name
    foundCategory.description = description
    DUMMY_CATEGORIES[foundIndex] = foundCategory
    
    res.status(200).json({message: 'Category Updated', category: foundCategory})
}

//DELETE
const deleteCategory = (req,res,next) => {
    const categoryId = req.params.id
    const foundCategory = DUMMY_CATEGORIES.find(category=>category.id===categoryId)
    if(!foundCategory) {
        return next(new HttpError('Category does not exist', 404))
    }
    DUMMY_CATEGORIES = DUMMY_CATEGORIES.filter(category=>category.id!==categoryId)
    res.status(200).json({message: 'Category deleted!'})
}

exports.createCategory = createCategory
exports.getAllCategories = getAllCategories
exports.getCategoryById = getCategoryById
exports.updateCategory = updateCategory
exports.deleteCategory = deleteCategory