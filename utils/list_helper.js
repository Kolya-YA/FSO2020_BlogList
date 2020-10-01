const blog = require("../models/blog")

const dummy = blogs => 1

const totalLikes = blogs => blogs.reduce((acc, cur) => acc + cur.likes, 0)

const favoriteBlog = blogs => {
  const result = [...blogs].sort((a, b) => b.likes - a.likes)[0]
  return result
    ? { title: result.title, author: result.author, likes: result.likes }
    : {}
}

const countBlogs = blogsArr => {  
  const authors = []
  blogsArr.forEach(x => {
    const idx = authors.findIndex(author => author['author'] === x.author)
    if (idx !== -1) {
      authors[idx].blogs++
      authors[idx].likes += x.likes
    } else {
      authors.push(
        {
          author: x.author,
          blogs: 1,
          likes: x.likes
        }
      )
    }
  })

  return authors
}

const mostBlogs = blogs => {
  const result = [...countBlogs(blogs)].sort((a, b) => b.blogs - a.blogs)[0]

  return result
    ? { author: result.author, blogs: result.blogs }
    : {}
}

const mostLikes = blogs => {
  const result = [...countBlogs(blogs)].sort((a, b) => b.likes - a.likes)[0]

  return result
    ? { author: result.author, likes: result.likes }
    : {}
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}