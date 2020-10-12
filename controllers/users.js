const bcrypt = require('bcrypt')
const usersRouter = require('express').Router() 
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const body = request.body
  
  if (!body.password) {
    const err = Error('Password is reuired!')
    err.name = 'ValidationError'
    throw err
  }

  if (body.password.length < 3) {
    const err = Error('Password too short!')
    err.name = 'ValidationError'
    throw err
  }

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