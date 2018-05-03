const router = require('express').Router()
const execsh = require('../util/execsh')
const config = require('config')
// 日志相关
const log = require('tracer').colorConsole({ level: config.log.level })

/**
 * Node服务部署
 */
router.post('/:server/', function (req, res) {
    //req.headers['x-gitlab-token'] == 'j9hb5ydtetfbRGQy42tNhztmJe1qSvC'
    log.info(`开始自动构建【${req.params.server}】...`)

    const commands = [
        `cd ${config.ci.nodeProjectDir}/${req.params.server}`,
        'git pull',
        `pm2 restart ${req.params.server}`
    ].join(' && ')

    execsh.run(commands)
    res.send('Y')
})

module.exports = router