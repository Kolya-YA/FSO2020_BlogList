const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { name: 1, login: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken) {
    return response.status(401).json({ error: 'Token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)
  const newBlog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user: user._id
  })

  const addedBlog = await newBlog.save()
  await addedBlog.populate('user', { name: 1, login: 1 }).execPopulate()
  user.blogs = user.blogs.concat(addedBlog._id)
  await user.save()
  response.status(200).json(addedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blogForDel = await Blog.findById(request.params.id)
  if (!blogForDel) return response.status(404).end()
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (decodedToken.id.toString() !== blogForDel.user.toString()) return response.status(403).end()
  await blogForDel.remove()
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    { runValidators: true, context: 'qwery', new: true }
  ).populate('user', { name: 1, login: 1 })
  response.status(200).json(updatedBlog)
})

module.exports = blogsRouter