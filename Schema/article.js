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

module.exports = ArticleSchema