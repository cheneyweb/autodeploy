# x-ci
轻巧精简的持续构建微服务

配置说明
```js
{
    "server": {
        "port": 10001, // 服务端口
        "staticRoot": "/xci/dist/", // WEB页面访问根路径
        "controllerRoot": "/xci/controller", // WEBHOOK根路径
        "mongodbUrl": "mongodb://localhost:27017/x-ci" // 数据库地址
    },
    "ci": {
        "nodeProjectDir": "/usr/local/node" // NODE类服务路径
    },
    "sh": { // 静态资源部署自定义脚本（服务名称:执行脚本）
        "cake": [
            "cd /usr/local/node/cake",
            "git pull",
            "pm2 restart cake"
        ],
        "upserver": {
            "sync": [ // 同步脚本，优先执行
                [
                    "cd /usr/local/node/upserver/",
                    "git pull",
                    "npm run build"
                ]
            ],
            "async": [ // 异步脚本，每个数组集合为一个Promise执行
                [
                    "cd /usr/local/node/x-ci/",
                    "rm -f pagelist.txt",
                    "./qshell listbucket upserver pagelist.txt",
                    "./qshell batchdelete -force upserver pagelist.txt",
                    "./qshell qupload ./qshell_upserver.conf"
                ]
            ]
        }
    }
}
```

使用说明
>
	1、需要在本地运行mongodb，并配置数据库地址路径
    2、于第三方git代码库中配置webhook，填写url【http://localhost:10001/xci/controller/static/:server】
    3、node app.js启动服务，访问localhost:10001/xci/dist/index.html

帮助联系
>
	作者:cheneyxu
	邮箱:457299596@qq.com
	QQ:457299596

更新日志
>
	2018.05.03:初版
    2018.05.04:切换Koa服务
    2018.05.10:配置优化，文档完善
