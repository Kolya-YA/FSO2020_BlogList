const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const usersHelper = require('./users_test_helper')
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
  const saltRounds = 10
  const blogObjects = await Promise.all(usersHelper.initialUsers.map(async user => {
    user.pswHash = await bcrypt.hash(user.password, saltRounds)
    return new User(user)
  }))
  const promiseArray = blogObjects.map(user => user.save())
  await Promise.all(promiseArray)
})

describe('Users DB tests', () => {
  test('Users list are returned as JSON', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('Users DB contain three blogs', async () => {
    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(3)
  })

  describe('Creating new user', () => {
    test('New valid user can be added', async () => {
      await api
        .post('/api/users')
        .send(usersHelper.newValidUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/users')
      expect(response.body).toHaveLength(usersHelper.initialUsers.length + 1)
      const userLogins = response.body.map(user => user.login)
      expect(userLogins).toContain(usersHelper.newValidUser.login)
    })

    test('New user w/o login return 400 Bad Request.', async () => {
      const badUser = { ...usersHelper.newValidUser }
      delete badUser.login
      await api
        .post('/api/users')
        .send(badUser)
        .expect(400)
    })

    test('New user w/o name return 400 Bad Request.', async () => {
      const badUser = { ...usersHelper.newValidUser }
      delete badUser.name
      await api
        .post('/api/users')
        .send(badUser)
        .expect(400)
    })

    test('New user w/o password return 400 Bad Request.', async () => {
      const badUser = { ...usersHelper.newValidUser }
      delete badUser.password
      await api
        .post('/api/users')
        .send(badUser)
        .expect(400)
    })

    test('New user with short login return 400 Bad Request.', async () => {
      const badUser = { ...usersHelper.newValidUser }
      badUser.login = badUser.login.substring(0, 2)
      await api
        .post('/api/users')
        .send(badUser)
        .expect(400)
    })

    test('New user with short password return 400 Bad Request.', async () => {
      const usersAtStart = await usersHelper.usersInDb()
      const badUser = { ...usersHelper.newValidUser }
      badUser.password = badUser.password.substring(0, 2)
      await api
        .post('/api/users')
        .send(badUser)
        .expect(400)
      const usersAtEnd = await usersHelper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('New user with not unique login return 400 Bad Request.', async () => {
      const usersAtStart = await usersHelper.usersInDb()
      const result = await api
        .post('/api/users')
        .send(usersHelper.initialUsers[0])
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.message).toContain('`login` to be unique')

      const usersAtEnd = await usersHelper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
  })
})


// test('New blog w/o URL return 400 Bad Request.', async () => {
//   await api
//     .post('/api/blogs')
//     .send(blogsHelper.newBlogWithOutUrl)
//     .expect(400)
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
// })

// describe('Updating blog', () => {
//   test('Valid updating returns "200"', async () => {
//     const response = await api.get('/api/blogs')
//     const idForUpdate = response.body[response.body.length - 1].id
//     await api
//       .put(`/api/blogs/${idForUpdate}`)
//       .send(blogsHelper.blogForUpdating)
//       .expect(200)
//   })

//   test('Correct updating title', async () => {
//     const response = await api.get('/api/blogs')
//     const idForUpdate = response.body[response.body.length - 1].id
//     const updatedBlog = await api
//       .put(`/api/blogs/${idForUpdate}`)
//       .send({ title: blogsHelper.blogForUpdating.title })

//     expect(updatedBlog.body.title).toBe(blogsHelper.blogForUpdating.title)
//   })

//   test('Correct updating likes', async () => {
//     const response = await api.get('/api/blogs')
//     const idForUpdate = response.body[response.body.length - 1].id
//     const updatedBlog = await api
//       .put(`/api/blogs/${idForUpdate}`)
//       .send({ likes: blogsHelper.blogForUpdating.likes })

//     expect(updatedBlog.body.likes).toBe(blogsHelper.blogForUpdating.likes)
//   })

//   test('Correct updating all fields (title, author, url and likes)', async () => {
//     const response = await api.get('/api/blogs')
//     const idForUpdate = response.body[response.body.length - 1].id
//     const updatedBlog = await api
//       .put(`/api/blogs/${idForUpdate}`)
//       .send(blogsHelper.blogForUpdating)

//     delete updatedBlog.body.id
//     expect(updatedBlog.body).toEqual(blogsHelper.blogForUpdating)
//   })
// })

afterAll(() => {
  mongoose.connection.close()
})