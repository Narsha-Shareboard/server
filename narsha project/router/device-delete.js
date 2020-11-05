const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const pool = require('../dbcon');
const secret = "share board"

router.delete('/device', function (req, res, next) {
    pool.getConnection((err, connection) => {
        const deviceId = req.body.deviceId;
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
            const cheakSubjectAndPurpose = (decodedToken) => {
                const userId = decodedToken.sub;
                console.log(userId);
                return userId;
            }
            const select_device = (userId) => {
                const p = new Promise((resolve, reject) => {
                    connection.query('select * from device where userId = ? and deviceId = ?', [userId, deviceId], (err, result) => {
                        if (err) reject(err);
                        console.log(result[0]);
                        if (result.length != 0) {
                            resolve(result[0]);
                        } else {
                            reject('값을 찾을 수 없습니다');
                        }
                    })
                })
                return p;
            }
            const delete_device = (device)=>{
                const p = new Promise((resolve, reject) => {
                    connection.query('delete from device where deviceId = ?', [device.deviceId], (err) => {
                        if (err) reject(err);
                        resolve(1)
                    })
                })
                return p;
            }

            const respond = (result) => {
                res.json({
                    result:"1"
                });
            }
            const onError = (err) => {
                res.status(403).json({
                    error: err.message
                })
            }

            cheakToken
                .then(cheakSubjectAndPurpose)
                .then(select_device)
                .then(delete_device)
                .then(respond)
                .catch(onError)
        }
    })
})

module.exports = router;