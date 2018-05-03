const exec = require('child_process').exec

const execOptions = {
    encoding: 'utf8',
    timeout: 0,
    maxBuffer: 20000 * 1024,// 最大缓存:20MB
    killSignal: 'SIGTERM',
    cwd: null,
    env: null
}

const execsh = {
    // 部署函数
    run(commands) {
        exec(commands, execOptions, (error, stdout, stderr) => {
            if (error) {
                console.error(`EXEC ERROR: ${error}`)
            }
            if (stdout) {
                console.log(`EXEC STDOUT: ${stdout}`)
            }
            if (stderr) {
                console.error(`EXEC STDERR: ${stderr}`)
            }
        })
    }
}

module.exports = execsh