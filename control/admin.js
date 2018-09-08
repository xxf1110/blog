// const { db } = require('../Schema/config')
// const ArticleSchema = require('../Schema/article')
// const Article = db.model('articles', ArticleSchema)
// const UserSchema = require('../Schema/user')
// const User = db.model('users', UserSchema)
// const CommentSchema = require('../Schema/comment')
// const Comment = db.model('Comments', CommentSchema)
const User = require('../Models/user')
const Article = require('../Models/article')
const Comment = require('../Models/comment')

const fs = require('fs')
const { join } = require('path')


exports.admin = async ctx => {
  if(ctx.session.isNew){
    ctx.status = 404
    return ctx.render('404', {
      title: '404'
    })
  }

  let id = ctx.params.id;

  let arr = fs.readdirSync(join(__dirname, '../views/admin'))
  let flag = false;
  arr.forEach((v) => {
    let name =  v.replace(/^(admin\-)|(\.pug)$/g, '')
    if(name === id){
      flag = true
    }
  })

  if(flag){
    await ctx.render('admin/admin-' + id, {
      role: ctx.session.role
    })
  }else{
    ctx.status = 404
    await ctx.render('404', {
      title: '404'
    })
  }

}

