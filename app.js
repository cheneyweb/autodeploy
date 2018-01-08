const express = require('express')
const exec = require('child_process').exec
const app = express()
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')

const PORT = 10001
const ROOT_DIR = '/usr/local/node'

app.use(bodyParser.json())

/**
 * 静态资源部署
 */
app.post('/deploy/static/:server/', function (req, res) {
    //req.headers['x-gitlab-token'] == 'j9hb5ydtetfbRGQy42tNhztmJe1qSvC'
    console.log(`开始自动构建【${req.params.server}】...`)
    let qbucket = ''
    switch (req.params.server) {
        case 'xserver':
            qbucket = 'page'
            break;
        default:
            qbucket = req.params.server
            break;
    }
    const commands = [
        `cd ${ROOT_DIR}/${req.params.server}/`,
        'git pull',
        'npm run build',

        `cd ${ROOT_DIR}/autodeploy/`,
        'rm -rf pagelist.txt',
        `./qshell listbucket ${qbucket} pagelist.txt`,
        `./qshell batchdelete -force ${qbucket} pagelist.txt`,
        `./qshell qupload ./qshell_${req.params.server}.conf`
    ].join(' && ')
    deploy(commands)
    res.send('Y')
})

/**
 * Node服务部署
 */
app.post('/deploy/node/:server/', function (req, res) {
    //req.headers['x-gitlab-token'] == 'j9hb5ydtetfbRGQy42tNhztmJe1qSvC'
    console.log(`开始自动构建【${req.params.server}】...`)
    const commands = [
        `cd ${ROOT_DIR}/${req.params.server}`,
        'git pull',
        `pm2 restart ${req.params.server}`
    ].join(' && ')
    deploy(commands)
    res.send('Y')
})

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
        port: 25,
        secure: false,
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
        log.info(`邮件发送完毕：${info}`)
        if (error) {
            return log.error(error)
        }
    });
    res.send('Y')
})

// 部署函数
function deploy(commands) {
    exec(commands, function (error, stdout, stderr) {
        if (error) {
            console.error(`exec error: ${error}`)
            return
        }
        if (stdout) {
            console.log(`stdout: ${stdout}`)
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`)
        }
    })
}

console.log(`autodeploy自动构建服务启动，端口：${PORT}`)
app.listen(PORT)