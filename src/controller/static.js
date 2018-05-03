var router = require('express').Router()
const execsh = require('../util/execsh')
const ROOT_DIR = '/usr/local/node'

/**
 * 静态资源部署
 */
router.post('/:server/', function (req, res) {
    //req.headers['x-gitlab-token'] == 'j9hb5ydtetfbRGQy42tNhztmJe1qSvC'
    console.log(`开始自动构建【${req.params.server}】...`)
    
    let qbucket = req.params.server
    switch (req.params.server) {
        case 'xserver':
            qbucket = 'page'
            break;
        case 'parcel-vue':
            qbucket = 'parcel'
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
    
    execsh.run(commands)
    res.send('Y')
})

module.exports = router