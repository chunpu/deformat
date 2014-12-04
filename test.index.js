var assert = require('assert')
var Match = require('./')

var t1 = Match.desugar('$a aa$b x${c}yz $dd')
assert.equal('${a} aa${b} x${c}yz ${dd}', t1)

var t2 = Match.escapeReg('$a|$b')
assert.equal('$a\\|$b', t2)

var t3 = Match.getVarReg('(\\w+)')
var arr3 = t3.exec('${var}')
assert.equal('var', arr3[1])

var combined = '$remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent"'
var log = '192.168.203.111 - - [03/Dec/2014:22:07:37 -0800] "GET /api/foo/bar?key=value&key=has space&key has \x22&key2=var2 HTTP/1.1" 404 576 "-" "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36"'
var t4 = Match(combined).exec(log)
assert.deepEqual({
    remote_addr: '192.168.203.111',
    remote_user: '-',
    time_local: '03/Dec/2014:22:07:37 -0800',
    request: 'GET /api/foo/bar?key=value&key=has space&key has "&key2=var2 HTTP/1.1',
    status: '404',
    body_bytes_sent: '576',
    http_referer: '-',
    http_user_agent: 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36'
}, t4)

console.log('test pass')
