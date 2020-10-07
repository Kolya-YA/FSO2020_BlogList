const errorHandler = (error, req, res, next) => {
  console.error('Error name: ', error.name)
  console.error('Error message: ', error.message)
  switch (error.name) {
  case 'ValidationError':
    res.status(400).send({ name: error.name, message: error.message })
    break
  default:
    next(error)
  }
}

module.exports = {
  errorHandler
}