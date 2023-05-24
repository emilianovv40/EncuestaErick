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
        }
        
        next()
    })
}


module.exports = middlewares