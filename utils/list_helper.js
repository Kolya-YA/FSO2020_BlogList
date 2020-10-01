const dummy = blogs => 1

const totalLikes = blogs => blogs.reduce((acc, cur) => acc + cur.likes, 0)

const favoriteBlog = blogs => {
  const result = [...blogs].sort((a, b) => b.likes - a.likes)[0]
  return result
    ? { title: result.title, author: result.author, likes: result.likes }
    : {}
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}