const express = require('express');
const router = express.Router();
const pool = require('../dbcon');

router.put('/device/:deviceId', (req, res) => {
    const { deviceName, deviceToken } = req.body;
    const deviceId = req.params.deviceId;
    const device = {
        deviceId: deviceId,
        deviceName: deviceName,
        deviceToken: deviceToken
    }
    if (!deviceName, !deviceId, !deviceToken) {
        res.json({
            error: "값이 비었습니다."
        })
    }
    pool.getConnection((err, connection) => {
        if (err) {
            res.status(400).json({
                error: err.message
            })
        }
        const deviceselect = new Promise((resolve, reject) => {
            connection.query(`select * from device where deviceId = ? and deviceToken = ?`, [deviceId, deviceToken], (err, result) => {
                if (err) reject(err);
                if (result.length == 0) reject(new Error("디바이스를 못 찾았습니다"))
                resolve(device)
            })
        })
        const update = (device) => {
            const p = new Promise((resolve, reject) => {
                connection.query(`update device set deviceName = ? where deviceId = ? and deviceToken = ?`, [device.deviceName, device.deviceId, device.deviceToken], (err, result) => {
                    if (err) reject(err);
                    console.log('deviceupdate', result);
                    resolve(1)
                })
            })
            connection.release()
            return p;
        }
        const respond = (result) => {
            console.log('device update done');
            res.json({
                result: result
            })
        }
        const onError = (err) => {
            console.log(err.message);
            res.json({
                error: err.message
            })
        }

        deviceselect
            .then(update)
            .then(respond)
            .catch(onError)
    })
})
module.exports = router