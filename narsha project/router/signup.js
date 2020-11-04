const express = require('express');
const { resolve } = require('path');
const router = express.Router();
const mysql = require('mysql');
const pool = require('../dbcon');

router.post('/signup', (req, res) => {
    console.log(req.body)
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            res.json({
                result: "0"
            })
        } else {
            const { userId, password } = req.body;
            console.log(userId, password);
            if (!userId || !password) {
                return res.status(400).json({
                    result: '0'
                });
            }
            const user = {
                userId: userId,
                password: password
            };

            const select = new Promise((resolve, reject) => {
                connection.query('Select * from user where userId = ?', [userId], (err, result) => {
                    if (err) reject(err);
                    if (result.length != 0) reject(new Error("2"));
                    resolve(user);
                })
            })
            const insert = (user) => {
                const p = new Promise((resolve, reject) => {
                    connection.query(`INSERT into user (userId, password) values (?,?)`, [user.userId, user.password], (err, result) => {
                        if (err) reject(err);
                        console.log(result);
                        resolve("1");
                    })
                    connection.release()
                })
                return p;
            }
            const success = (message) => {
                console.log(userId, '회원가입 성공');
                res.json({
                    result: "1"
                })
            }
            const onErr = (err) => {
                console.log(userId, '회원가입 실패');
                res.status(403).json({
                    result: '0'
                })
            }

            select
                .then(insert)
                .then(success)
                .catch(onErr)
        }

    })

});

module.exports = router;