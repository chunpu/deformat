Usage
---

```js
var Deformat = require('deformat')
var deformat = Deformat('$foo $bar') // init template
deformat.exec('myfoo mybar') // exec a string like regexp
// => {foo: "myfoo", bar: "mybar"}
```

Demo
---

Parse nginx access log is such a pain because `split(/\s+/)` will fail to work if there is **space** in request url or other nginx var

Deformat can parse nginx default log_format **combined** access log clearly and easily

```nginx
log_format combined '$remote_addr - $remote_user [$time_local] '
    '"$request" $status $body_bytes_sent '
    '"$http_referer" "$http_user_agent"';
```

```js
var combined = '$remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent"'

var log = '192.168.203.111 - - [03/Dec/2014:22:07:37 -0800] "GET /api/foo/bar?key=value&key=has space&key has \x22&key2=var2 HTTP/1.1" 404 576 "-" "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36"'

Deformat(combined).exec(log)
// => output
{
    remote_addr: '192.168.203.111',
    remote_user: '-',
    time_local: '03/Dec/2014:22:07:37 -0800',
    request: 'GET /api/foo/bar?key=value&key=has space&key has "&key2=var2 HTTP/1.1',
    status: '404',
    body_bytes_sent: '576',
    http_referer: '-',
    http_user_agent: 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36'
}
```

Tips
---

`$var` is sugar for `${var}`

```js
Deformat('${foo}someword$bar').exec('myfoosomewordmybar')
// => 
{
    foo: 'myfoo',
    bar: 'mybar'
}
```

You can just skip chars by using `*`

```js
Deformat('$foo * $bar').exec('myfoo xxx-{} ##yyy zzz^( mybar')
// => 
{
    foo: 'myfoo',
    bar: 'mybar'
}
```
