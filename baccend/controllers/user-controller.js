const { v4:uuid } = require('uuid')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const HttpError = require('../models/http-error')

let DUMMY_USERS = [
    {
        id: uuid(),
        name: 'Test Subject One',
        image: 'https://images.unsplash.com/photo-1597721813494-9f6b0cd697f9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
        email: 'testone@mail.com',
        password: 'qazwsx'
    },
    {
        id: uuid(),
        name: 'Test Subject Two',
        image: 'https://images.unsplash.com/photo-1597740800878-b1c97d500a39?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
        email: 'testtwo@mail.com',
        password: 'xswzaq'
    }
]

//SIGN UP

const signUp = async (req,res,next) => {
    const { name, image, email, password  } = req.body
    const foundEmail = DUMMY_USERS.find(user=>user.email===email)

    if(foundEmail) {
        return next(new HttpError('Email exists, try logging in',422))
    }
    let encryptedPassword
    let token 

    try {
        encryptedPassword = await bcrypt.hash(password, 12)
    } catch (error) {
        return next(new HttpError('Auth failed',401))
    }

    try {
        token = jwt.sign({email, password}, 'fucc_them_kids',{expiresIn:'1h'})
    } catch (error) {
        return next(new HttpError('Auth failed',401))
    }

    const createUser = {
        id: uuid() ,name, image, email, encryptedPassword, token
    }
    DUMMY_USERS.unshift(createUser)

    res.status(201).json({message: 'Sign Up Successful', user: { name, image, email, token}})
}

const login = async (req,res,next) => {
    const { email, password } = req.body

    const foundEmail = DUMMY_USERS.find(user=>user.email===email)

    if(!foundEmail) {
        return next(new HttpError('Email does not exist', 401))
    }

    let isPassword
    let token

    try {
        isPassword = await bcrypt.compare(password, foundEmail.password)
    } catch (error) {
        return next(new HttpError('Auth Failed', 401))
    }

    if(!isPassword) {
        return next(new HttpError('Invalid password', 401))
    }

    try {
        token = jwt.sign({email, password},'fucc_them_kids',{expiresIn:'1h'})
    } catch (error) {
        return next(new HttpError('Could not generate token', 500))
    }

    res.status(200).json({message: 'Logged In', user: {id: foundEmail.id, email, token }})
}

exports.signUp = signUp
exports.login = login