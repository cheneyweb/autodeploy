// 系统配置参数
const config = require('config')
const port = config.server.port
// 应用服务
const Koa = require('koa')
const koaBody = require('koa-body')
const xcontroller = require('koa-xcontroller')
// 日志相关
const log = require('tracer').colorConsole({ level: config.log.level })

// 初始化应用服务
const app = new Koa()
app.use(koaBody())

// 加载所有控制器
xcontroller.init(app, config.server)

log.info(`x-ci持续集成服务启动，端口：${10001}`)
app.listen(10001)