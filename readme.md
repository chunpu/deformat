Deformat
===

deformat is the contrary of format, inspired by express/koa route

Install
---

```sh
npm install deformat
```

Usage
---

```js
var Deformat = require('deformat')
var deformat = Deformat('$foo $bar')
deformat.exec('myfoo mybar')
// => {foo: "myfoo", bar: "mybar"}
```


