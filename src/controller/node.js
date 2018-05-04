// 路由相关
const Router = require('koa-router')
// 工具相关
const execsh = require('../util/execsh')
const config = require('config')
// 日志相关
const log = require('tracer').colorConsole({ level: config.log.level })
// 初始化路由
const router = new Router()

/**
 * Node服务部署
 */
router.post('/:server/', async function (ctx, next) {
    //req.headers['x-gitlab-token'] == 'j9hb5ydtetfbRGQy42tNhztmJe1qSvC'
    log.info(`开始自动构建【${ctx.params.server}】...`)

    const commands = [
        `cd ${config.ci.nodeProjectDir}/${ctx.params.server}`,
        'git pull',
        `pm2 restart ${ctx.params.server}`
    ].join(' && ')

    execsh.run(commands)
    ctx.body = 'Y'
})

module.exports = router