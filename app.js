// 系统配置参数
const config = require('config')
const port = config.server.port
// 日志相关
const log = require('tracer').colorConsole({ level: config.log.level })
// 应用服务
const express = require('express')
const app = express()
// 应用中间件
const bodyParser = require('body-parser')
const xcontroller = require('express-xcontroller')
// 工具
const nodemailer = require('nodemailer')

// 中间件加载
app.use(bodyParser.json())
// 加载所有控制器
xcontroller.init(app, config.server)

/**
 * 邮件服务
 */
app.post('/email/send', function (req, res) {
    let inparam = req.body
    console.log(`开始发送邮件【${inparam.emailserver}:${inparam.emailtype}:${inparam.username}:${inparam.emaildata}】...`)
    if (inparam.emailkey != 'cheneyemail') {
        return
    }
    let captcha = inparam.emaildata
    let transporter = nodemailer.createTransport({
        host: 'smtp.mxhichina.com',
        port: 465,
        secure: true,
        auth: {
            user: "captcha@xserver.top",
            pass: "Qiyexys36"
        }
    });

    let mailOptions = {
        from: '"UPLOG" <captcha@xserver.top>',
        to: inparam.username,
        subject: `UPLOG注册验证码:${captcha}`,
        text: `感谢您注册UPLOG云日志服务，这是您的邮箱验证码：<b>${captcha}</b>`,
        html: `感谢您注册UPLOG云日志服务，这是您的邮箱验证码：<b>${captcha}</b>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        console.info(`邮件发送完毕：${JSON.stringify(info)}`)
        if (error) {
            return console.error(error)
        }
    });
    res.send('Y')
})

log.info(`x-ci持续集成服务启动，端口：${10001}`)
app.listen(10001)