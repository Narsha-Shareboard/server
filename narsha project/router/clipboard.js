const express = require('express');
const { resolve } = require('path');
const router = express.Router();
const pool = require('../dbcon');

router.post('/clipboard', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            res.json({
                result: "0"
            })
        } else {
            const { deviceId, board, date } = req.body;
            console.log(deviceId, board);
            if (!deviceId || !board) {
                return res.status(400).json({
                    result: "0"
                })
            }
            const clipboard = {
                deviceId: deviceId,
                board: board
            };
            console.log(deviceId);

            /*function formatDate(date) {
                return moment(date).format('YYYY-MM-DD HH:mm:ss');
            }

            const datetime = new Promise((resolve, reject) => {
                connection.query(`select * from clipboard where date = ?`, [clipboard.date], (err, result) => {
                    console.log(clipboard.date);
                    if (err) reject(err);

                    rows = rows.map(function (row) {
                        return Object.assign({}, row, { created_date: formatDate(row.created_date) });
                    });

                    console.log(rows);
                })
            });*/

            const boardSelect = new Promise((resolve, reject) => {
                connection.query(`select * from clipboard where board= ?`, [clipboard.board], (err, result) => {

                    if (err) reject(err);

                    resolve(board);
                })
            });


            const insert = (deviceId) => {
                console.log(deviceId);
                const p = new Promise((resolve, reject) => {
                    connection.query(`insert into clipboard (deviceId, board, date) values (?,?,now())`, [clipboard.deviceId, clipboard.board, clipboard.date], (err, result) => {
                        if (err) reject(err);
                        console.log(result);
                        resolve(result.insertBoard);
                    });
                    connection.release();
                })
                return p;
            }
            const success = (boardId) => {
                console.log(boardId, '클립보드 전송 성공');
                res.json({
                    result: "1",
                    boardId: boardId
                })
            }
            const onErr = (err) => {
                console.log(err, '클립보드 전송 실패');
                res.status(403).json({
                    result: '0'
                })
            }
            boardSelect
                .then(insert)
                .then(success)
                .catch(onErr)

        }

    })

})

module.exports = router;