//const log = require('./log.js').log

module.exports = {
  eval: (arg, callback) => {
    var self = this
    var jsString = arg
    var isError = false
    try {
      eval(jsString)
      // log(jsString)
    //  log('')
    } catch (e) {
      isError = true
      console.log("logging", e)
      // var err = e.constructor('Error in Evaled Script: ' + e.message);
      // console.log(err.lineNumber)
    //  log(e.message, "log-error")
      //console.log('ERROR', JSON.stringify(e))
    }
  //  console.log('callback is', callback)
    if(callback) callback(jsString, isError)
  }
}
