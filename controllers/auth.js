const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const keys = require('../config/keys')
const errorHandler = require('../utils/errorHandler')

module.exports.login = async function(req, res) {
    const candidate = await User.findOne({email: req.body.email})

    if (candidate) {
        // проверка пароля у существующего пользователя
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
        if (passwordResult) {
            // Генерируем токен, пароли совпали
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, {expiresIn: 60*60})

            try {
                res.status(200).json({
                    token: `Bearer ${token}`
                })
            } catch(e) {
                // Обработать ошибку
            }
        } else {
            // Пароли не совпали
            res.status(401).json({
                message: 'Пароль неверный. Попробуйте снова.'
            })
        }
    } else {
        // пользователя нет, ошибка
        res.status(404).json({
            message: 'Пользователь с таким email не найден.'
        })
    }
}


module.exports.register = async function(req, res) {
    // email password
    const candidate = await User.findOne({ email: req.body.email })

    if (candidate) {
        // user exists, must be error returning
        res.status(409).json({
            message: 'Такой email уже занят. Попробуйте другой.'
        })
    } else {
        // user must be created
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        })
        try {
            await user.save()
            res.status(201).json(user)
        } catch(e) {
            errorHandler(res, e)
        }
    }
}

