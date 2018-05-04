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

帮助联系
>
	作者:cheneyxu
	邮箱:457299596@qq.com
	QQ:457299596

更新日志
>
	2018.05.03:初版
    2018.05.04:切换Koa服务
