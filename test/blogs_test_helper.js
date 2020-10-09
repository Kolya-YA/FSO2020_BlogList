const Blog = require('../models/blog')

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
  likes: 222333,
  user: []
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs,
  newValidBlog,
  newBlogWithOutLikes,
  newBlogWithOutTitle,
  newBlogWithOutUrl,
  blogForUpdating,
  blogsInDb
}