const { Schema } = require('./config')
const ObjectId = Schema.Types.ObjectId

const ArticleSchema = new Schema({
  title: String,
  content: String,
  tips: String,
  author: {
    type: ObjectId,
    ref: 'users'
  },
  commentNum: {
    type: Number,
    default: 0
  }
}, { 
  versionKey: false,  
  timestamps: {
    createdAt: 'created',
    updatedAt: "updated"
  }
})


ArticleSchema.post('remove', async doc => {
  const User = require('../Models/user')
  const Comment = require('../Models/comment')

  const {_id, author} = doc

  await User.updateOne({ _id: author }, { $inc: { articleNum: -1}}).exec()

  await Comment.find({article: _id})
    .then(data => {
      data.forEach(v => v.remove())
    })
    .catch(err => console.log(err))


})

module.exports = ArticleSchema