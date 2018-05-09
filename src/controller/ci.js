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
router.get('/config', async function (ctx, next) {
    delete config.ci.nodeProjectDir
    ctx.body = config.ci
})

/**
 * 持续集成服务配置修改
 */
router.post('/configupdate', async function (ctx, next) {
    let inparam = ctx.request.body
    config.ci = inparam
    ctx.body = config.ci
})

module.exports = router