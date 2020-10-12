const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const blogsHelper = require('./blogs_test_helper')
const usersHelper = require('./users_test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const usersRouter = require('../controllers/users')

beforeAll(async () => {
  await User.deleteMany({})
  const saltRounds = 10
  const blogObjects = await Promise.all(usersHelper.initialUsers.map(async user => {
    user.pswHash = await bcrypt.hash(user.password, saltRounds)
    return new User(user)
  }))
  const promiseArray = blogObjects.map(user => user.save())
  await Promise.all(promiseArray)
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.updateMany({}, { $unset: { 'blogs' : 1 } })
  const listOfUsers = await User.find({})
  const blogObjects = blogsHelper.initialBlogs.map(blog => {
    const randomUser = Math.floor(Math.random() * listOfUsers.length)
    blog.user = listOfUsers[randomUser]._id
    return new Blog(blog)
  })
  const blogsPromiseArray = blogObjects.map(blog => blog.save())
  const savedBlogs = await Promise.all(blogsPromiseArray)

  savedBlogs.forEach(blog => {
    const uIdx = listOfUsers.findIndex(user => user._id === blog.user)
    listOfUsers[uIdx].blogs = listOfUsers[uIdx].blogs.concat(blog._id)
  })

  const usersPromiseArray = listOfUsers.map(user => user.save())
  await Promise.all(usersPromiseArray)
})

describe.only('Init DB', () => {
  test('Blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('Blogs DB contain four blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(4)
  })

  test('Id and User propertyis is defined', async () => {
    const { body } = await api.get('/api/blogs')
    expect(body[0].id).toBeDefined()
    expect(body[0].user).toBeDefined()
  })
})

describe('Create new Blog', () => {

  test('New valid blog can be added', async () => {
    await api
      .post('/api/blogs')
      .send(blogsHelper.newValidBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(blogsHelper.initialBlogs.length + 1)
    const blogTitles = response.body.map(blog => blog.title)
    expect(blogTitles).toContain(blogsHelper.newValidBlog.title)
  })

  //   test('Zero is default of likes', async () => {
  //     const response = await api
  //       .post('/api/blogs')
  //       .send(blogsHelper.newBlogWithOutLikes)
  //     expect(response.body.likes).toBe(0)
  //   })

  //   test('New blog w/o titile return 400 Bad Request.', async () => {
  //     await api
  //       .post('/api/blogs')
  //       .send(blogsHelper.newBlogWithOutTitle)
  //       .expect(400)
  //   })

  //   test('New blog w/o URL return 400 Bad Request.', async () => {
  //     await api
  //       .post('/api/blogs')
  //       .send(blogsHelper.newBlogWithOutUrl)
  //       .expect(400)
  //   })
  // })

  // describe('Deletion of a note', () => {
  //   test('Succeeds with code "204" if "id" is valid', async () => {
  //     const blogsAtStart = await blogsHelper.blogsInDb()
  //     const blogToDelete = blogsAtStart[0]

  //     await api
  //       .delete(`/api/blogs/${blogToDelete.id}`)
  //       .expect(204)

  //     const blogsAtEnd = await blogsHelper.blogsInDb()
  //     expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

  //     const titles = blogsAtEnd.map(blog => blog.title)
  //     expect(titles).not.toContain(blogToDelete.title)
  //   })

  //   test('"400" if "id" is not valid', async () => {
  //     const notValidId = '222aaa333bbb'

  //     await api
  //       .delete(`/api/blogs/${notValidId}`)
  //       .expect(400)
  //   })
})

describe('Updating blog', () => {
  test('Valid updating returns "200"', async () => {
    const response = await api.get('/api/blogs')
    const idForUpdate = response.body[response.body.length - 1].id
    await api
      .put(`/api/blogs/${idForUpdate}`)
      .send(blogsHelper.blogForUpdating)
      .expect(200)
  })

  test('Correct updating title', async () => {
    const response = await api.get('/api/blogs')
    const idForUpdate = response.body[response.body.length - 1].id
    const updatedBlog = await api
      .put(`/api/blogs/${idForUpdate}`)
      .send({ title: blogsHelper.blogForUpdating.title })

    expect(updatedBlog.body.title).toBe(blogsHelper.blogForUpdating.title)
  })

  test('Correct updating likes', async () => {
    const response = await api.get('/api/blogs')
    const idForUpdate = response.body[response.body.length - 1].id
    const updatedBlog = await api
      .put(`/api/blogs/${idForUpdate}`)
      .send({ likes: blogsHelper.blogForUpdating.likes })

    expect(updatedBlog.body.likes).toBe(blogsHelper.blogForUpdating.likes)
  })

  test('Correct updating all fields (title, author, url and likes)', async () => {
    const response = await api.get('/api/blogs')
    const idForUpdate = response.body[response.body.length - 1].id
    const updatedBlog = await api
      .put(`/api/blogs/${idForUpdate}`)
      .send(blogsHelper.blogForUpdating)

    delete updatedBlog.body.id
    expect(updatedBlog.body).toEqual(blogsHelper.blogForUpdating)
  })
})

afterAll(() => {
  mongoose.connection.close()
})