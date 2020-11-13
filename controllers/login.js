const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const loginRouter = require('express').Router()

loginRouter.post('/', async (request, response) => {
  const body = request.body
  const user = await User.findOne({ login: body.login })
  const pswCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.pswHash)

  if (!(user && pswCorrect)) {
    return response.status(401).json({ error: 'Invalid login or password' })
  }

  const userForToken = {
    login: user.login,
    id: user._id
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ name: user.name, login: user.login, token })
})

module.exports = loginRouter