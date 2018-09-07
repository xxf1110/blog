const { Schema } = require('./config')

const UserSchema = new  Schema({
  username: String,
  password: String,
  avatar: {
    type: String,
    default: "/avatar/default.jpg"
  },
  articleNum: {
    type: Number,
    default: 0
  },
  commentNum: {
    type: Number,
    default: 0
  },
  role: {
    type: Number,
    default: 1
  }
}, {versionKey: false})

module.exports = UserSchema