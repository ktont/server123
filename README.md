# server123

十二种nodejs服务器脚手架，这是第三种，http api 服务器



## 如何使用?

```
npm install
node ./app.js &

curl localhost:3000/demo1

```

## http 小型的框架

在 req res 中注入了下列属性

### req.query_

请求中的参数

```
/api/jj?a=12

对应

{ a: '12' }
```

```
/api/jj?a=12&a=34

对应

{ a: [ '12', '34' ] }
```

### req.body_

POST 数据

```
$.ajax('/api/jj', {
	data:{a:'12'}, 
	method:'POST'
})

对应

{ a: '12' }
```

### req.pathname_

请求路径

```
/api/jj?a=12
/api/jj／
/api/jj#xxx
都对应
/api/jj
```

### res.send200

返回 200    

```
res.send200({
	ret: [1,3,4],
	errMsg: 'ok'
});
```

text/plain 格式

### res.send500

返回500    

```
res.send500(new Error('fake'));
```

text/plain 格式


## 携带的功能有

* mysql 驱动，一定要用pool模式，pool模式是全自动的
* redis 驱动，内置 script 功能
* logger 模块，day log格式
* async await/promise 处理http请求
* http api 轻、小型的框架


