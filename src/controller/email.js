// 路由相关
const Router = require('koa-router')
// 工具
const nodemailer = require('nodemailer')
const config = require('config')
// 日志相关
const log = require('tracer').colorConsole({ level: config.log.level })
// 初始化路由
const router = new Router()

/**
 * 邮件服务
 */
router.post('/send', async function (ctx, next) {
    let inparam = ctx.request.body
    log.info(`开始发送邮件【${inparam.emailserver}:${inparam.emailtype}:${inparam.username}:${inparam.emaildata}】...`)
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
    })

    let mailOptions = {
        from: '"UPLOG" <captcha@xserver.top>',
        to: inparam.username,
        subject: `UPLOG注册验证码:${captcha}`,
        text: `感谢您注册UPLOG云日志服务，这是您的邮箱验证码：<b>${captcha}</b>`,
        html: `感谢您注册UPLOG云日志服务，这是您的邮箱验证码：<b>${captcha}</b>`
    }

    transporter.sendMail(mailOptions, (error, info) => {
        log.info(`邮件发送完毕：${JSON.stringify(info)}`)
        if (error) {
            return log.error(error)
        }
    })

    ctx.body = 'Y'
})

module.exports = router