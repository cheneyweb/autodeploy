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
 * 持续集成服务列表
 */
router.get('/ciconfig', async function (ctx, next) {
    delete config.ci.nodeProjectDir
    ctx.body = config.ci
})

module.exports = router