const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('Blogs are returned as JSON', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('Blog DB contain two blogs', async () => {
  const response = await api.get('/api/blogs')  
  expect(response.body).toHaveLength(2)
})

test.only('Id propertyis is defined', async () => {
  const { body } = await api.get('/api/blogs')
  console.log('Body: ', body[0])
  expect(body[0].id).toBeDefined()
})

afterAll(() => {
  mongoose.connection.close()
})