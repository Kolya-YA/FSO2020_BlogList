// const Blog = require('../models/blog')

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

module.exports = {
  initialBlogs,
  newValidBlog,
  newBlogWithOutLikes
}