const { Schema } = require('./config')

const ArticleSchema = new Schema({
  title: String,
  content: String,
  tips: String,
  author: String
}, { 
  versionKey: false,  
  timestamps: {
    createdAt: 'created',
    updatedAt: "updated"
  }
})

module.exports = ArticleSchema