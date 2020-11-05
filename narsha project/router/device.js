const express = require('express');
const { resolve } = require('path');
const router = express.Router();
const mysql = require('mysql');
const pool = require('../dbcon');

router.post('/device', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            res.json({
                result: "0"
            })
        } else {
            const { deviceName, deviceToken, userId, typeName } = req.body;
            console.log(deviceName, deviceToken, userId, typeName);
            if (!deviceName || !deviceToken || !userId || !typeName) {
                return res.status(400).json({
                    result: "0"
                })
            }
            const device = {
                deviceName: deviceName,
                deviceToken: deviceToken,
                userId: userId,
                typeName: typeName
            };
            console.log(device);
            /*const typeInsert = new Promise((resolve, reject)=>{
                connection.query(`insert into deviceType (typeName) values (?)`, device.typeName, (err, result)=>{
                    if(err) reject(err);
                    resolve(result.insertId);
                })

            })*/
            const typeSelect =
                new Promise((resolve, reject) => {
                    connection.query(`select * from deviceType where typeName = ?`, [device.typeName], (err, result) => {
                        if (err) reject(err);
                        if (result.length == 0) {
                            reject(0);
                        }
                        else {
                            resolve(result[0].typeId)
                        }
                    })
                })




            const select = (typeId) => {
                const p = new Promise((resolve, reject) => {
                    connection.query(`Select * from device where deviceName = ? and userId = ?`, [device.deviceName, device.userId], (err, result) => {

                        if (err) reject(err);
                        if (result.length != 0) reject(new Error("2"));
                        console.log(result);
                        resolve(typeId);
                    })

                })
                return p;
            }

            const insert = (typeId) => {
                console.log(typeId)
                const p = new Promise((resolve, reject) => {
                    connection.query(`INSERT into device (deviceName, deviceToken, userId, typeId) values (?,?,?,?)`, [device.deviceName, device.deviceToken, device.userId, typeId], (err, result) => {
                        if (err) reject(err);
                        console.log(result);
                        resolve(result.insertId);
                    });
                    connection.release();
                });
                return p;
            }

            /*const sendId = (message)=>{
                const p = new Promise((resolve, reject) => {
                    connection.query(`SELECT LAST_INSERT_ID()`, (err, result) => {
                        if (err) reject(err);
                        console.log(result);
                        resolve(result);
                    });
                    connection.release();
                })
            };*/

            const success = (deviceId) => {
                console.log(deviceId, '장치등록 성공');
                res.json({
                    result: "1",
                    deviceId: deviceId
                });
            }

            const onErr = (err) => {
                console.log(err, '장치등록 실패');
                res.status(403).json({
                    result: '0'
                })
            }
            typeSelect
                .then(select)
                .then(insert)
                .then(success)
                .catch(onErr)
        }
    })
});

module.exports = router;