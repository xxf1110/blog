const { Schema } = require('./config')
const ObjectId = Schema.Types.ObjectId

const CommentSchema = new Schema({
  content: String,
  from: {
    type: ObjectId,
    ref: 'users'
  },
  article: {
    type: ObjectId,
    ref: 'articles'
  }
}, {
  versionKey: false,
  timestamps: {
    createdAt: "created",
    updatedAt: "updated"
  }
})


CommentSchema.post("remove", async doc => {
  const User = require('../Models/user')
  const Article = require('../Models/article')
  const {from, article} = doc

  await Article.updateOne({ _id: article }, {$inc: {commentNum: -1}}).exec()

  await User.updateOne({ _id: from }, {$inc: {commentNum: -1}}).exec()
  
})


module.exports = CommentSchema