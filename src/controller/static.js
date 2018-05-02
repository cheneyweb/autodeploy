var router = require('express').Router()
const exec = require('child_process').exec
const ROOT_DIR = '/usr/local/node'

/**
 * 静态资源部署
 */
router.post('/:server/', function (req, res) {
    //req.headers['x-gitlab-token'] == 'j9hb5ydtetfbRGQy42tNhztmJe1qSvC'
    console.log(`开始自动构建【${req.params.server}】...`)
    let qbucket = ''
    switch (req.params.server) {
        case 'xserver':
            qbucket = 'page'
            break;
        case 'parcel-vue':
            qbucket = 'parcel'
            break;
        default:
            qbucket = req.params.server
            break;
    }
    const commands = [
        `cd ${ROOT_DIR}/${req.params.server}/`,
        'git pull',
        'npm run build',

        `cd ${ROOT_DIR}/x-ci/`,
        'rm -rf pagelist.txt',
        `./qshell listbucket ${qbucket} pagelist.txt`,
        `./qshell batchdelete -force ${qbucket} pagelist.txt`,
        `./qshell qupload ./qshell_${req.params.server}.conf`
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