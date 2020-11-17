const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Bla-Bla-Bla Blog — 1',
    author: 'Pupkine A.',
    url: 'https://blablabla1.example.com',
    likes: 100
  },
  {
    title: 'Bla-Bla-Bla Blog — 2',
    author: 'Pupkine B.',
    url: 'https://blablabla2.example.com',
    likes: 200
  },
  {
    title: 'Bla-Bla-Bla Blog — 3',
    author: 'Pupkine C.',
    url: 'https://blablabla3.example.com',
    likes: 300
  },
  {
    title: 'Bla-Bla-Bla Blog — 4',
    author: 'Pupkine D.',
    url: 'https://blablabla4.example.com',
    likes: 400
  }
]

const newValidBlog = {
  title: 'Bla-Bla-Bla Blog — NEW',
  author: 'New Pupkine A.',
  url: 'https://new.blablabla.example.com',
  likes: 100500
}

const newBlogWithOutLikes = {
  title: 'Bla-Bla-Bla Blog — without likes',
  author: 'No Likes Pupkine A.',
  url: 'https://nolikes.blablabla.example.com'
}

const newBlogWithOutTitle = {
  author: 'New Pupkine A.',
  url: 'https://new.blablabla.example.com',
  likes: 100500
}

const newBlogWithOutUrl = {
  title: 'Bla-Bla-Bla Blog — NEW',
  author: 'New Pupkine A.',
  likes: 100500
}

const blogForUpdating = {
  title: 'Title of updated blog',
  author: 'Author of updated blog',
  url: 'URL of updated blog',
  likes: 222333
}

const blogComments = [
  'Test comments — 1',
  'Test comments — 2',
  'Test comments — 3',
  'Test comments — 4',
  'Test comments — 5',
  'Test comments — 6',
  'Test comments — 7',
  'Test comments — 8',
  'Test comments — 9',
  'Test comments — 10',
  'Test comments — 11',
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const userToken = async () => {
  const user = await User.findOne({})
  const userForToken = {
    login: user.login,
    id: user._id
  }
  return `bearer ${jwt.sign(userForToken, process.env.SECRET)}`
}

module.exports = {
  initialBlogs,
  newValidBlog,
  newBlogWithOutLikes,
  newBlogWithOutTitle,
  newBlogWithOutUrl,
  blogForUpdating,
  blogComments,
  blogsInDb,
  userToken
}