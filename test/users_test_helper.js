const User = require('../models/user')

const initialUsers = [
  {
    name: 'Pupkine W. User-1',
    login: 'pupkine-1@example.com',
    password: '123pupkine1',
    blogs: []
  },
  {
    name: 'Pupkine W. User-2',
    login: 'pupkine-2@example.com',
    password: '123pupkine2',
    blogs: []
  },
  {
    name: 'Pupkine W. User-3',
    login: 'pupkine-3@example.com',
    password: '123pupkine3',
    blogs: []
  },
]

const newValidUser = {
  name: 'Pupkine W. User-NEW',
  login: 'pupkine-new@example.com',
  password: '123pupkineNEW',
  blogs: []
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}


module.exports = {
  initialUsers,
  newValidUser,
  usersInDb
}