const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  login: {
    type: String
  },
  pswHash: {
    type: String
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.pswHash
  }
})

const User = mongoose.model('User', userSchema)
module.exports = User