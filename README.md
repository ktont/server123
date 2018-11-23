# server123

十二种nodejs服务器脚手架，这是第三种，http api 服务器

## 如何使用?

```
npm install
node ./app.js &

curl localhost:3000/demo1

```

## 携带的功能有

* mysql 驱动，一定要用pool模式，pool模式是全自动的
* redis 驱动，内置 script 功能
* logger 模块，day log格式
* async await/promise 处理http请求
* http api 轻、小型的框架，res.send200 + res.send500


