const { validationResult } = require('express-validator')
const HttpError = require('../models/http-error')
const Category = require('../models/Category')

//CREATE
const createCategory = async (req,res,next) => {
    const error = validationResult(req)
    if(!error.isEmpty()) {
        return next(new HttpError('Provide all the required fields',422))
    }
    const { name, description } = req.body
    const newCategory = {
        name, description, expenses: []
    }
    const cat = new Category(newCategory)
    try {
        await cat.save()
    } catch (error) {
        return next(new HttpError('Could not create category',500))
    }
    res.status(201).json({message: 'Created', category: cat.toObject({getters:true})})

}

//READ
const getAllCategories = async (req,res,next) => {

    let allCategories

    try {
        allCategories = await Category.find()
    } catch (error) {
        return next(new HttpError('Could not fetch categories',500))
    }

    res.status(200).json({totalCategories: allCategories.length, categories: allCategories.map(category=>category.toObject({getters:true}))})
}

const getCategoryById = async (req,res,next) => {
    const categoryId = req.params.id
    let foundCategory
    try {
     foundCategory = Category.findById(categoryId)   
    } catch (error) {
        return next(new HttpError('Could not find category',500))
    }
    if(!foundCategory) {
        return next(new HttpError('Category does not exist', 404))
    }
    res.status(200).json({category: (await foundCategory).toObject({getters:true})})
}

//UPDATE
const updateCategory = async (req,res,next) => {
    const categoryId = req.params.id
    const { name, description } = req.body
    let foundCategory
    try {
        foundCategory = await Category.findById(categoryId)
    } catch (error) {
        return next(new HttpError('Could not find category',500))
    }
    if(!foundCategory) {
        return next(new HttpError('Category does not exist', 404))
    }
    foundCategory.name = name
    foundCategory.description = description
    try {
        await foundCategory.save()
    } catch (error) {
        return next(new HttpError('Update failed!',500))
    }
    
    res.status(200).json({message: 'Category Updated', category: foundCategory.toObject({getters:true})})
}

//DELETE
const deleteCategory = async (req,res,next) => {
    const categoryId = req.params.id
    let foundCategory
    try {
        foundCategory = await Category.findById(categoryId)
    } catch (error) {
        return next(new HttpError('Could not find category',500))
    }
    if(!foundCategory) {
        return next(new HttpError('Category does not exist', 404))
    }
    foundCategory.remove()
    res.status(200).json({message: 'Category deleted!'})
}

exports.createCategory = createCategory
exports.getAllCategories = getAllCategories
exports.getCategoryById = getCategoryById
exports.updateCategory = updateCategory
exports.deleteCategory = deleteCategory