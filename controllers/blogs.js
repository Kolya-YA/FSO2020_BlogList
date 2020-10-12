const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { name: 1, login: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const listOfUsers = await User.find({})
  const randomUser = Math.floor(Math.random() * listOfUsers.length)
  const newBlog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user: listOfUsers[randomUser]._id
  })

  const addedBlog = await newBlog.save()
  listOfUsers[randomUser].blogs = listOfUsers[randomUser].blogs.concat(addedBlog._id)
  await listOfUsers[randomUser].save()
  response.status(200).json(addedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const delBlog = await Blog.findByIdAndRemove(request.params.id)
  delBlog ? response.status(204).end() : response.status(400).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    { runValidators: true, context: 'qwery', new: true}
  )
  response.status(200).json(updatedBlog)
})

module.exports = blogsRouter