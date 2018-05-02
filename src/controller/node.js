var router = require('express').Router()
const ROOT_DIR = '/usr/local/node'

/**
 * Node服务部署
 */
router.post('/:server/', function (req, res) {
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

module.exports = router