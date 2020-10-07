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

test('Blogs DB contain two blogs', async () => {
  const response = await api.get('/api/blogs')  
  expect(response.body).toHaveLength(2)
})

test('Id propertyis is defined', async () => {
  const { body } = await api.get('/api/blogs')
  expect(body[0].id).toBeDefined()
})

test('New valid blog can be added', async () => {
  await api
    .post('/api/blogs')
    .send(helper.newValidBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')  
  expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
  const blogTitles = response.body.map(blog => blog.title)
  expect(blogTitles).toContain(helper.newValidBlog.title)
})

test('Zero is default of likes', async () => {
  const response = await api
    .post('/api/blogs')
    .send(helper.newBlogWithOutLikes)
  expect(response.body.likes).toBe(0)
})

test('New blog w/o titile return 400 Bad Request.', async () => {
  await api
    .post('/api/blogs')
    .send(helper.newBlogWithOutTitle)
    .expect(400)
})

test('New blog w/o URL return 400 Bad Request.', async () => {
  await api
    .post('/api/blogs')
    .send(helper.newBlogWithOutUrl)
    .expect(400)
})

describe('Deletion of a note', () => {
  test('Succeeds with code "204" if "id" is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).not.toContain(blogToDelete.title)
  })

  test('"400" if "id" is not valid', async () => {
    const notValidId = '222aaa333bbb'
    
    await api
      .delete(`/api/blogs/${notValidId}`)
      .expect(400)
  })
})

describe('Updating blog', () => {
  test('Valid updating returns "200"', async () => {
    const response = await api.get('/api/blogs')
    const idForUpdate = response.body[response.body.length - 1].id
    await api
      .put(`/api/blogs/${idForUpdate}`)
      .send(helper.blogForUpdating)
      .expect(200)
  })

  test('Correct updating title', async () => {
    const response = await api.get('/api/blogs')
    const idForUpdate = response.body[response.body.length - 1].id
    const updatedBlog = await api
      .put(`/api/blogs/${idForUpdate}`)
      .send({ title: helper.blogForUpdating.title })

    expect(updatedBlog.body.title).toBe(helper.blogForUpdating.title)
  })

  test('Correct updating likes', async () => {
    const response = await api.get('/api/blogs')
    const idForUpdate = response.body[response.body.length - 1].id
    const updatedBlog = await api
      .put(`/api/blogs/${idForUpdate}`)
      .send({ likes: helper.blogForUpdating.likes })

    expect(updatedBlog.body.likes).toBe(helper.blogForUpdating.likes)
  })

  test('Correct updating all fields (title, author, url and likes)', async () => {
    const response = await api.get('/api/blogs')
    const idForUpdate = response.body[response.body.length - 1].id
    const updatedBlog = await api
      .put(`/api/blogs/${idForUpdate}`)
      .send(helper.blogForUpdating)
    
    delete updatedBlog.body.id
    expect(updatedBlog.body).toEqual(helper.blogForUpdating)
  })
})

afterAll(() => {
  mongoose.connection.close()
})