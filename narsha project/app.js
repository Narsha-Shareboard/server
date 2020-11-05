const express = require('express');
const app = express();
const mysql = require('./dbcon');

//Router
const signup = require('./router/signup');
const signin = require('./router/signin');
const autologin = require("./router/autoLogin");
const device = require('./router/device');
const device_inquiry = require('./router/device-inquiry');
const device_delete = require("./router/device-delete");
const device_update = require("./router/device-update");
const clipboard = require('./router/clipboard');
const clipboard_inquiry = require('./router/clipboard-inquiry');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(signup, signin, autologin, device, device_inquiry, device_delete, device_update, clipboard, clipboard_inquiry);

module.exports = app;