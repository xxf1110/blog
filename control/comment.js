
// const { db } = require('../Schema/config')
// const CommentSchema = require('../Schema/comment')
// const Comment = db.model('comments', CommentSchema)
// const ArticleSchema = require('../Schema/article')
// const Article = db.model('articles', ArticleSchema)
// const UserSchema = require('../Schema/user')
// const User = db.model('users', UserSchema)
const User = require('../Models/user')
const Article = require('../Models/article')
const Comment = require('../Models/comment')

exports.save = async ctx => {
  let message = {
    status: 0,
    msg: '用户未登录'
  }

  if(ctx.session.isNew){
    return ctx.body = message
  }
  const data = ctx.request.body
  data.from = ctx.session.uid

  await new Promise((resolve, reject) => {
    new Comment(data)
      .save((err, data) => {
        if(err) return reject(err)
        resolve(data)
      })
  })
  .then(async data => {
    message = {
      status: 1,
      msg: '评论成功'
    }
    Article.updateOne({ _id: data.article }, { $inc: { commentNum: 1 } }, err => {
        if (err) console.log(err)
      }
    )
    User.updateOne({ _id: data.from}, { $inc: { commentNum: 1 }}, err => {
        if (err) console.log(err)
      }
    )
  })  
  .catch(err => {
    message = {
      status: 0,
      msg: '评论失败'
    }
  })

  ctx.body = message
}

exports.getCom = async ctx => {
  const data =  await Comment
    .find({from: ctx.session.uid})
    .populate({
      path: 'article',
      select: "title"
    })
    .then(data => data)
    .catch(err => {
      console.log(err)
    })
   ctx.body ={
      code: 0,
      count: data.length,
      data
  }
}


exports.del = async ctx => {
  // let id = ctx.params.id
  // let message = {}
  // let artId = await Comment
  //   .findById(id)
  //   .populate({
  //     path: 'article',
  //     select: "_id"
  //   })
  //   .then(data => data.article._id)
  //   .catch(err => console.log(err))
    
  // await Comment.deleteOne({_id: id}).then(data => {
  //   message = {
  //     state: 1,
  //     message: "删除成功"
  //   }
  // })
  // .catch(err => {
  //   message = {
  //     state: 0,
  //     message: "删除失败"
  //   }
  // })
  
  // await User
  //   .updateOne({ _id: ctx.session.uid }, { $inc: { commentNum: -1 } })
  //   .then(data => {})
  //   .catch(err => {
  //     console.log('文章数据库减1失败')
  //   })
  // await Article
  //   .updateOne({_id: artId}, {$inc: {commentNum: -1}})
  //   .then(data => {})
  //   .catch(err => {
  //     console.log('文章数据库减1失败')  
  //   })

  // ctx.body = message

  let id = ctx.params.id
  let data = {
    state: 1,
    message: "删除成功"
  }
  await Comment.findById(id)
    .then(data => {
      data.remove()
    })
    .catch(err => {
      data = {
        state: 0,
        message: "删除失败"
      }
    })

    ctx.body = data

}
