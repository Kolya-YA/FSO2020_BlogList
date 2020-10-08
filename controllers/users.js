const bcrypt = require('bcrypt')
const usersRouter = require('express').Router() 
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const body = request.body
  const saltRounds = 10
  const pswHash = await bcrypt.hash(body.password, saltRounds)

  const newUser = new User({
    name: body.name,
    login: body.login,
    pswHash
  })

  const savedUser = await newUser.save()
  response.json(savedUser)
})


module.exports = usersRouter