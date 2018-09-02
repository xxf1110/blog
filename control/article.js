const { db } = require('../Schema/config')
const ArticleShema = require('../Schema/article')

const Article = db.model('articles', ArticleShema)

exports.addPage = async ctx => {
  await ctx.render('add-article', {
    title: '文章发表',
    session: ctx.session
  })
}



exports.add = async ctx => {
  if(ctx.session.isNew){
    return ctx.body = {
      status: 0,
      msg: '用户未登录'
    }
  }

  const data = ctx.request.body
  data.author = ctx.session.username
  
  await new Promise((resolve, reject) => {
    new Article(data)
      .save((err, data) => {
        if(err) return reject(err)
        resolve(data)
      })
    })
    .then(data => {
      ctx.body = {
        status: 1,
        msg: '发表成功'
      }
    })
    .catch(err => {
      ctx.body = {
        status: 0,
        msg: '发表失败'
      }
    })
  
}

