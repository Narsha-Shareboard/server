const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const pool = require('../dbcon');
const secret = "share board"

router.get('/device', function (req, res, next) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            res.json({
                result: "0"
            })
        } else {
            const token = req.headers.authorization// || req.query.token
            if (!token) {
                return res.status(403).json({
                    error: 'No Token'
                })
            }
            const cheakToken = new Promise((resolve, reject) => {
                jwt.verify(token, secret, (err, decondedToken) => {
                    if (err) reject(err);
                    console.log(decondedToken)
                    resolve(decondedToken)
                })
            })
            cheakSubjectAndPurpose = (decodedToken) => {
                const p = new Promise((resolve, reject) => {
                    const userId = decodedToken.sub;
                    console.log(userId);
                    resolve(userId);
                })
                return p;
            }
            const device = (userId) => {
                const p = new Promise((resolve, reject) => {
                    connection.query('select * from device where userId = ?', [userId], (err, result) => {
                        if (err) reject(err);
                        if (result.length != 0) {
                            resolve(result);
                        } else {
                            reject('값을 찾을 수 없습니다');
                        }
                    })
                    connection.release();
                })
                return p;
            }
            const respond = (device) => {
                res.json({
                    device
                });
            }
            const onError = (err) => {
                res.status(403).json({
                    error: err.message
                })
            }

            cheakToken
                .then(cheakSubjectAndPurpose)
                .then(device)
                .then(respond)
                .catch(onError)
        }
    })
})

module.exports = router;