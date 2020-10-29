# standard-router    标准节点

```bash
# 典型案例
standard
├── src                          (节点工程文件)
|  ├── routes                    (路由层)
|  |  ├── IndexView              (路由页面节点--视图UI层)
|  |  |  ├── Components          (组件文件夹)
|  |  |  |   └── XXX组件          (组件名)
|  |  |  |      ├── index.js     (组件代码文件)
|  |  |  |      └── index.less   (组件样式文件)
|  |  |  ├── index.js            (页面入口文件)
|  |  |  └── index.less          (页面样式文件)
|  |  |
|  |  ├── index.js               (路由入口文件)
|  |  ├── service.js             (服务层)
|  |  └── model.js               (数据模型层)
|  |
|  ├── app.js                    (节点入口文件)
|  ├── app.less                  (节点公共样式)
|  └── index.html                (模板文件)
|
├── package.json                 (节点单独信息)
└── README.md                    (说明文档)
```
