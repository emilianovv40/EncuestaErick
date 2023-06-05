require('express')
require('dotenv').config()
require('cookie-parser')
const jwt = require('jsonwebtoken')
const db = require('../config/db')
const middlewares = {}

middlewares.verifyAuth = (req,res,next) => {

    const token = req.cookies.auth
    if(token == undefined){
        res.redirect('/login')
        return
    }

    const decode = jwt.decode(token, process.env.JWT_SECRET)

    db.query(`SELECT * FROM usuarios WHERE id_usuario = "${decode}"`, (err,user) => {
        if(err) throw err
        if(user.length == 0){
            res.redirect('/login')
            return
        }
        
        next()
    })
}

middlewares.verifyAdmin = (req,res,next) => {
    const token = req.cookies.auth
    if(token == undefined){
        res.redirect('/login')
        return
    }

    const decode = jwt.decode(token, process.env.JWT_SECRET)
    db.query(`SELECT * FROM usuarios id_usuario = "${decode}"`, (err,user) => {
        if(err) throw err
        if(user.length == 0){
            res.redirect('/login')
            return
        }
        if(user[0].admin == 1){
            next()
        }
        res.redirect('/login')
    })
}


module.exports = middlewares