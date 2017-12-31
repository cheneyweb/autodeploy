const express = require('express')
const exec = require('child_process').exec
const app = express()

const PORT = 10001
const ROOT_DIR = '/usr/local/node'

/**
 * 静态资源部署
 */
app.post('/deploy/static/:server/', function (req, res) {
    //req.headers['x-gitlab-token'] == 'j9hb5ydtetfbRGQy42tNhztmJe1qSvC'
    console.log(`开始自动构建【${req.params.server}】...`)
    const commands = [
        `cd ${ROOT_DIR}/${req.params.server}/`,
        'git pull',
        'npm run build',

        `cd ${ROOT_DIR}/autodeploy/`,
        'rm -rf pagelist.txt',
        './qshell listbucket page pagelist.txt',
        './qshell batchdelete -force page pagelist.txt',
        './qshell qupload ./qshell.conf'
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