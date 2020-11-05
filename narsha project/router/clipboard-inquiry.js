const express = require('express');
const { resolve } = require('path');
const router = express.Router();
const jwt = require('jsonwebtoken');
const secret = "share board"
const pool = require('../dbcon');

router.get('/clipboard', (req, res) => {
    pool.getConnection((err, connection) => {
        const token = req.headers.authorization;
        if (!token) return res.status(403).json({
            error: "No Token"
        })
        const cheakToken = new Promise((resolve, reject) => {
            jwt.verify(token, secret, (err, decodeToken) => {
                if (err) reject(err);
                console.log(decodeToken);
                resolve(decodeToken);
            })
        })
        const cheaksubject = (decodedToken) => {
            const userId = decodedToken.sub;
            console.log(userId);
            return userId;
        }
        const select_clipboard = (userId) => {
            const p = new Promise((resolve, reject) => {
                connection.query(`select c.board, c.deviceId, c.date, d.deviceName, d.userId, d.typeId from clipboard as c join device as d on c.deviceId = d.deviceId where d.userId = ?`, [userId], (err, result) => {
                    if (err) reject(err);
                    if (result.length == 0) reject(new Errror("값이 없습니다"));
                    resolve(result);
                })
            })
            return p
        }
        const select_deviceType = (clipboard) => {
            const p = new Promise((resolve, reject) => {
                for (let i = 0; i < clipboard.length; i++) {
                    connection.query(`select deviceName from deviceType where typeId = ?`, [clipboard[i].typeId], (err, result) => {
                        if (err) reject(err);
                        clipboard[i].typeName = result[0].typeName;
                    })
                }
                resolve(clipboard);
            })
            return p;
        }

        const respond = (result) => {
            res.json({
                result
            })
        }

        const onError = (err) => {
            res.status(403).json({
                error: err.message
            })
        }

        cheakToken
            .then(cheaksubject)
            .then(select_clipboard)
            .then(respond)
            .catch(onError)
    })
})

module.exports = router;