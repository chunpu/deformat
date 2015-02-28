module.exports = exports = MatchReg

function desugar(str) {
    // $var is sugar for ${var}
    return str.replace(/\$(\w+)/g, '\${$1}')
}

function escapeReg(str) {
    //return str.replace(/[-[\]{}()+?.,\\^|#\s]/g, '\\$&')
    return str.replace(/[-[\]()+?.,\\^|#\s]/g, '\\$&')
}

function getVarReg(val) {
    return new RegExp('\\' + '$\\{' + val + '\\}', 'g')
}

exports.escapeReg = escapeReg
exports.desugar = desugar
exports.getVarReg = getVarReg

function MatchReg(str, opt) {
    if (!(this instanceof MatchReg)) return new MatchReg(str, opt)
    opt = opt || {}
    this.raw = str
    str = desugar(str)
    this._raw = str
    this.reg = this.getReg(opt.flags)
    this.names = this.getNames()
}

var proto = MatchReg.prototype

proto.getNames = function() {
    var tmplReg = getVarReg('(\\w+)')
    var tmpl = this._raw.replace(tmplReg, '$1') // raw may be wrong
    var names = this.reg.exec(tmpl)
    return names
}

proto.getReg = function(flags) {
    var nameReg = getVarReg('\\w+')
    var escaped = escapeReg(this._raw)
    var ret = escaped.replace(nameReg, '(?:(.+?))').replace(/\*/g, '(.*)')
    ret = '^' + ret + '$'
    return new RegExp(ret, flags)
}

proto.exec = function(str) {
    var arr = this.reg.exec(str)
    var names = this.names
    if (names && arr) {
        var ret = {}
        for (var i = 1; i < arr.length; i++) {
            if ('*' != names[i]) {
                ret[names[i]] = arr[i]
            }
        }
        return ret
    }
    return null
}
