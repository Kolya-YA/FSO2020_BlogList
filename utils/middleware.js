const errorHandler = (error, req, res, next) => {
  console.error('Error name: ', error.name)
  console.error('Error message: ', error.message)
  switch (error.name) {
  case 'ValidationError':
    res.status(400).send({ name: error.name, message: error.message })
    break
  case 'JsonWebTokenError':
    res.status(401).send({ name: error.name, message: error.message })
    break
  case 'CastError':
    res.status(204).send({ name: error.name, message: error.message })
    break
  default:
    next(error)
  }
}

const jwtTokenExtractor = (req, res, next) => {
  const auth = req.get('authorization')
  if (auth?.toLowerCase().startsWith('bearer ')) {
    req.token = auth.substring(7)
  }
  next()
}

module.exports = {
  errorHandler,
  jwtTokenExtractor
}