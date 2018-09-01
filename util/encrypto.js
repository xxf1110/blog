const crypto = require('crypto')


module.exports = function(password, key = 'xxf') {
  const hmac = crypto.createHmac('sha256', key)
  hmac.update(password)
  let pwdHmac = hmac.digest('hex')
  return pwdHmac;  
}