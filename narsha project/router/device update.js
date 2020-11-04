const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../dbcon');

router.put('/device/:deviceId', (req, res)=>{
    const {deviceName, deviceToken, userId, typeId} = req.body;
    const deviceId = req.params.deviceId;
})