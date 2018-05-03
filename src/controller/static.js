var router = require('express').Router()
const execsh = require('../util/execsh')
const _ = require('lodash')
// 日志相关
const config = require('config')
const log = require('tracer').colorConsole({ level: config.log.level })
// const ROOT_DIR = '/usr/local/node'

/**
 * 静态资源部署
 */
router.post('/:server/', function (req, res) {
    //req.headers['x-gitlab-token'] == 'j9hb5ydtetfbRGQy42tNhztmJe1qSvC'
    log.info(`开始自动构建【${req.params.server}】...`)

    // let qbucket = req.params.server
    // switch (req.params.server) {
    //     case 'xserver':
    //         qbucket = 'page'
    //         break;
    //     case 'parcel-vue':
    //         qbucket = 'parcel'
    //         break;
    // }

    // const commands = [
    //     `cd ${ROOT_DIR}/${req.params.server}/`,
    //     'git pull',
    //     'npm run build',

    //     `cd ${ROOT_DIR}/x-ci/`,
    //     'rm -rf pagelist.txt',
    //     `./qshell listbucket ${qbucket} pagelist.txt`,
    //     `./qshell batchdelete -force ${qbucket} pagelist.txt`,
    //     `./qshell qupload ./qshell_${req.params.server}.conf`
    // ].join(' && ')

    let deployCommand = config.ci[req.params.server]
    // 数组直接运行命令
    if (deployCommand instanceof Array) {
        execsh.runSync(deployCommand.join(' && '))
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
    res.send('Y')
})

module.exports = router