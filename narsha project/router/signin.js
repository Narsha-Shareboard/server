const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const secrit = "share board"
const pool = require('../dbcon')

router.post('/signin', (req, res) => {
    const { userId, password } = req.body;
    if (!userId || !password) {
        res.json({
            result: "0"
        })
    }
    pool.getConnection((err, connection) => {
        const signin = new Promise((resolve, reject) => {
            connection.query("select * from user where userId = ? and password = ?", [userId, password], (err, result) => {
                if (err) {
                    console.log('err:', err)
                    reject(err);
                } else {
                    if (!result[0]) reject("0")
                    else resolve(userId)
                }
            })
        })

        const authrize = (userId) => {
            console.log('user = ', userId)
            const p = new Promise((resolve, reject) => {
                let extime = Math.floor(Date.now() / 1000) + (60 * 60)
                jwt.sign({
                    sub: userId,
                    iat: Math.floor(Date.now() / 1000),
                    exp: extime
                }, secrit,
                    (err, token) => {
                        if (err) reject(err)
                        resolve(token)
                    })
            })
            return p
        }
        const response = (token) => {
            console.log('auth done');
            res.json({
                result: "1",
                token
            })
        }
        const onError = (err) => {
            console.log('signin Error')
            res.status(403).json({
                result: 0
            })
        }

        signin
            .then(authrize)
            .then(response)
            .catch(onError)
    })
})

module.exports = router;