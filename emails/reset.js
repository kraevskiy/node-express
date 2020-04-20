const keys = require('../keys')

module.exports = function (email, token) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: 'Reset password',
    html: `
      <h1>Reset password!!!</h1>
      <p>If not, ignore this mail</p>
      <p>else click link</p>
      <p><a href="${keys.BASE_URL}/auth/password/${token}">Reset password</a></p>
      <hr />
      <a href="${keys.BASE_URL}">Store</a>
    `
  }
}