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
  data.author = ctx.session.uid
  
  await new Promise((resolve, reject) => {
    new Article(data)
      .save((err, data) => {
        if(err) return reject(err)
        User.updateOne({_id: data.author}, {$inc: {articleNum: 1}}, err => {
          if(err) return err
        })
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

exports.getList = async ctx => {
  let page = ctx.params.id || 1
  page--;
  let limit = 2
  let maxNum = await Article.estimatedDocumentCount((err, num) => err ? console.log(err) : num)
  
  const artList = await Article
    .find()
    .sort('-created')
    .skip(limit * page)
    .limit(limit)
    .populate({
      path: "author",
      select: '_id username avatar'
    })
    .then(data => data)
    .catch(err => console.log(err))

  await ctx.render('index', {
    title: 'blog',
    session: ctx.session,
    artList,
    maxNum
  })
}

exports.details = async ctx => {
  let id = ctx.params.id;

  const article =  await Article
    .findById(id)
    .populate('author', 'username')
    .then(data => data)
    .catch(err => {
      console.log(err)
    })  

  const comment = await Comment
    .find({article: id})
    .sort('-updated')
    .populate({
      path: 'from',
      select: 'username avatar'
    })
    .then(data => data)
    .catch(err => {
        console.log(err)
    })  

  await ctx.render('article', {
    title: 'blog',
    session: ctx.session,
    article,
    comment,
  })
}

exports.getArt = async ctx => {
  let res = {}
  await Article
    .find({author: ctx.session.uid})
    .then(data => {
      res = {
        code: 0,
        count: data.length,
        data
      }
    })
    .catch(err => {
      console.log(err)
    })

    ctx.body = res
}

exports.del = async ctx => {
  // let id = ctx.params.id
  // let message = {}

  // await Comment
  //   .find({article: id})
  //   .then(async data => {
  //     for (let i = 0, len = data.length; i < len; i++) {
  //       let userId = data[i].from._id
  //       await User.updateOne({ _id: userId }, { $inc: { commentNum: -1 } }).then(data => {}).catch(err => console.log(err))
  //     }
  //   })
  //   .catch(err => console.log(err))

  // await Comment.deleteMany({article: id}).then(data => {}).catch(err => console.log(err))

  // await User.updateOne({ _id: ctx.session.uid }, { $inc: {articleNum: -1}})

  // await Article
  //   .deleteOne({_id: id})
  //   .then(data => {
  //     message = {
  //       state: 1,
  //       message: "删除成功"
  //     }
  //   })
  //   .catch(err => {
  //     message = {
  //       state: 0,
  //       message: "删除失败"
  //     }
  //   })

  // ctx.body = message

  let id = ctx.params.id
  let message = {
    state: 1,
    message: "删除成功"
  }

  await Article.findById(id)
    .then(data => {
      data.remove()
    })
    .catch(err => {
      message = {
        state: 0,
        message: "删除失败"
      }
    })

  ctx.body = message

}

