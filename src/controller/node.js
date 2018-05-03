var router = require('express').Router()
const execsh = require('../util/execsh')
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
    
    execsh.run(commands)
    res.send('Y')
})

module.exports = router