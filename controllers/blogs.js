const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const newBlog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes
  })

  const addedBlog = await newBlog.save()  
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