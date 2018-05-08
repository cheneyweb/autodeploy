const child_process = require('child_process')
const config = require('config')
const log = require('tracer').colorConsole({ level: config.log.level })

const execOptions = {
    encoding: 'utf8',
    timeout: 0,
    maxBuffer: 20000 * 1024,// 最大缓存:20MB
    killSignal: 'SIGTERM',
    cwd: null,
    env: null
}

const execsh = {
    runSync(commands) {
        let output = child_process.execSync(commands, execOptions)
        log.info(output)
        return output
    },
    run(commands) {
        return new Promise((resolve, reject) => {
            child_process.exec(commands, execOptions, (error, stdout, stderr) => {
                if (error) {
                    log.error(`EXEC ERROR: ${error}`)
                }
                if (stdout) {
                    log.info(`EXEC STDOUT: ${stdout}`)
                }
                if (stderr) {
                    log.error(`EXEC STDERR: ${stderr}`)
                }
                resolve({ error, stdout, stderr })
            })
        })
    }
}

module.exports = execsh