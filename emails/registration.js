const keys = require('../keys')

module.exports = function (email) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: 'Registration successfull',
    html: `
      <h1>Welcome!!!</h1>
      <p>You success create account on email ${email}</p>
      <hr />
      <a href="${keys.BASE_URL}">Store</a>
    `
  }
}