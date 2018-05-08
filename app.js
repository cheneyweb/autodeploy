// 系统配置参数
const config = require('config')
const port = config.server.port
// 应用服务
const Koa = require('koa')
const mount = require('koa-mount')
const staticServer = require('koa-static')
const koaBody = require('koa-body')
const cors = require('@koa/cors')
const xcontroller = require('koa-xcontroller')
const xnosql = require('koa-xnosql')

// 日志相关
const log = require('tracer').colorConsole({ level: config.log.level })

// 初始化应用服务
const app = new Koa()
// 启用静态资源服务
app.use(mount(config.server.staticRoot, staticServer(`${__dirname}/dist`)))
// 跨域处理
app.use(mount('/deploy/xci/', cors()))  // CI跨域请求
app.use(mount('/xci/xnosql/', cors()))  // CI跨域请求
// 入参处理
app.use(koaBody())

// 加载所有控制器
xcontroller.init(app, config.server)
// 加载koa-xnosql中间件
xnosql.init(app, config.server)

log.info(`x-ci持续集成服务启动，端口：${10001}`)
app.listen(10001)