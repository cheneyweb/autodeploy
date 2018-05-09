# x-ci
轻巧精简的持续构建微服务

```json
"ci": {
    "upserver": {
        "sync": [
            [
                "cd /usr/local/node/upserver/",
                "git pull"
            ]
        ],
        "async": [
            [
                "npm run build",
                "cd /usr/local/node/x-ci/",
                "rm -f pagelist.txt",
                "./qshell listbucket upserver pagelist.txt",
                "./qshell batchdelete -force upserver pagelist.txt",
                "./qshell qupload ./qshell_upserver.conf"
            ]
        ]
    }
}
```

使用说明
>
	1、需要在本地运行mongodb，并于config/default.json中配置mongodbUrl
    2、于config/default.json的 ci 配置项中，写入需要持续集成的脚本
    3、于第三方git代码库中配置webhook，填写url【http://localhost:10001/xci/controller/static/:server】
    4、node app.js启动服务，访问localhost:10001/xci/dist/index.html

帮助联系
>
	作者:cheneyxu
	邮箱:457299596@qq.com
	QQ:457299596

更新日志
>
	2018.05.03:初版
    2018.05.04:切换Koa服务
