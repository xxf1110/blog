const encrypto = require('../util/encrypto')
const { db } = require('../Schema/config')
const UserSchema = require('../Schema/user')
const User = db.model('users', UserSchema)
const CommentSchema = require('../Schema/comment')
const Comment = db.model('comments', CommentSchema)
const ArticleSchema = require('../Schema/article')
const Article = db.model('articles', ArticleSchema)


// 登录注册页面
exports.userPage = async ctx => {
  let path = ctx.path
  let show = (path === '/user/login') ? false : true
  await ctx.render('register', { show })
}
// 注册
exports.reg = async ctx => {
  let userinfo = ctx.request.body 
  let username = userinfo.username
  let password = userinfo.password
  await new Promise((resolve, reject) => {
    User.find({ username }, (err, data) => {
      if (err) return reject(err)
      if(data.length !== 0) return resolve('')
      const user = new User({
        username,
        password: encrypto(password)
      })
      user.save((err, data) => {
        if(err){
          reject(err)
        }else{
          resolve(data)
        }
      })
    })
  }).then(async data => {
    if(data){
      await ctx.render('isOk', {
        status: '注册成功'
      })
    }else{
      await ctx.render('isOk', {
        status: "用户名已存在"
      })
    }
  }).catch(async err => {
    await ctx.render('isOk', {
      status: "注册失败"
    })
  })
}

//登录
exports.login = async ctx => {
  let userinfo = ctx.request.body
  let username = userinfo.username
  let password = userinfo.password
  await new Promise((resolve, reject) => {
    User.find({username}, (err, data) => {
      if(err) return reject(err)
      if(data.length === 0) return reject('用户名不存在')
      if(data[0].password === encrypto(password)){
        return resolve(data)
      }
      resolve('')
    })
  }).then(async data => {
    if(!data){
      return ctx.render('isOk', {
        status: "密码错误，登录失败"
      })
    }

    ctx.cookies.set("username", username, {
      domain: "localhost",
      path: "/",
      maxAge: 36e5,
      overwrite: false,
      httpOnly: true,
      signed: false
    })

    ctx.cookies.set("uid", data[0]._id, {
      domain: "localhost",
      path: "/",
      maxAge: 36e5,
      overwrite: false,
      httpOnly: true,
      signed: false
    })   

    ctx.session = {
      username,
      uid: data[0]._id,
      avatar: data[0].avatar,
      role: data[0].role
    }

    await ctx.render('isOk', {
      status: "登录成功"
    }) 

  }).catch(async err => {
    if(typeof err === 'string'){
      return ctx.render('isOk', {
        status: err
      })
    }
    await ctx.render('isOk', {
      status: "登录失败"
    })
  })


}
// 更新头像
const updateAvatar = async (ctx) => {
  let data = await User
    .findById(ctx.session.uid)
    .then(data => data)
    .catch(err => {
      console.log(err)
    })

  ctx.session = {
    username: data.username,
    uid: data._id,
    avatar: data.avatar,
    role: data.role
  }
}

exports.keepLog = async(ctx, next) => {
  if(ctx.session.isNew){  // true没有设置session
    if(ctx.cookies.get('uid')){
      updateAvatar(ctx)
    }
  }else{
    updateAvatar(ctx)
  }
  await next()
}

exports.logout = async ctx => {
  ctx.session = null
  ctx.cookies.set("username", null, {
    maxAge: 0
  })
  ctx.cookies.set("uid", null, {
    maxAge: 0
  })
  ctx.redirect("/")
}

exports.admin = () => {
  User
    .find({username: 'admin'})
    .then(data => {
      if(data.length === 0){
        new User({
          username: 'admin',
          password: encrypto('admin'),
          role: 100
        })
        .save()
        .then(data => {
          console.log(`管理员账户： 用户名 -> ${data[0].username}  密码 -> admin`)
        })
        .catch(err => {
          console.log('管理员检查失败')
        })
      }else{
        console.log(`管理员账户： 用户名 -> ${data[0].username}  密码 -> admin`)
      }
    })
    .catch(err => {
      console.log(err)
    })

  
  
}

exports.upload = async ctx => {
  let filename = ctx.req.file.filename
  let data = {}
  await User.updateOne({_id: ctx.session.uid}, {$set: {avatar: '/avatar/' + filename}}, (err, res) => {
    if(err){
      data = {
        message: '上传失败'
      }
      return
    }
    data = {
      message: '上传成功'
    }
  })

  ctx.body = data
}


exports.getUsers = async ctx => {
  const data = await User
    .find()
    .then(data => data)
    .catch(err => console.log(err))

  ctx.body = {
    code: 0,
    count: data.length,
    data
  }
}


exports.del = async ctx => {
  let id = ctx.params.id
  let message = {}
  if(id === ctx.session.uid){
    ctx.body = {
      state: 0,
      message: "删除失败"
    }
    return
  }

  await User.deleteOne({_id: id}, (err, data) => {
    if(err) return console.log(err)
    message = {
      state: 1,
      message: "删除成功"
    }
  })

  await Article.deleteMany({author: id}, (err, data) => {
    if (err) return console.log(err)
  })

  await Comment.deleteMany({ from: id }, (err, data) => {
    if (err) return console.log(err)
  })

  ctx.body = message

}