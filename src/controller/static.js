// 路由相关
const Router = require('koa-router')
// 工具相关
const execsh = require('../util/execsh')
const _ = require('lodash')
// 日志相关
const config = require('config')
const log = require('tracer').colorConsole({ level: config.log.level })
// 初始化路由
const router = new Router()

/**
 * 静态资源部署
 */
router.post('/:server/', async function (ctx, next) {
    //req.headers['x-gitlab-token'] == 'j9hb5ydtetfbRGQy42tNhztmJe1qSvC'
    log.info(`开始自动构建【${ctx.params.server}】...`)

    let deployCommand = config.ci[ctx.params.server]
    // 数组直接运行命令
    if (deployCommand instanceof Array) {
        execsh.run(deployCommand.join(' && '))
    }
    // 根据同步和异步命令执行
    else {
        // 解析同步和异步命令
        let syncCommandArr = _.flatten(deployCommand.sync)
        let asyncCommandArr = deployCommand.async
        // 执行同步命令
        log.info('开始执行同步命令...')
        execsh.runSync(syncCommandArr.join(' && '))
        // 执行异步命令
        log.info('开始执行异步命令...')
        for (let commandArr of asyncCommandArr) {
            execsh.run(commandArr.join(' && '))
        }
    }

    ctx.body = 'Y'
})

module.exports = router