const encrypto = require('../util/encrypto')
const { db } = require('../Schema/config')
const UserSchema = require('../Schema/user')

const User = db.model('users', UserSchema)

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
      uid: data[0]._id
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


exports.keepLog = async(ctx, next) => {
  if(ctx.session.isNew){  // true没有设置session
    if(ctx.cookies.get('uid')){
      ctx.session = {
        username: ctx.cookies.get('username'),
        uid: ctx.cookies.get('uid')
      }
    }
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