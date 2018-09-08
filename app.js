const Koa = require('koa')
const static = require('koa-static')
const views = require('koa-views')
const  { join } = require('path')
const logger = require('koa-logger')  
const body = require('koa-body')
const session = require('koa-session')
const router = require('./routers/router')
const { admin } = require('./control/user')
const compress = require('koa-compress')
const app = new Koa

app.keys = ['this is keys']

// session 配置对象
const CONFIG = {
  key: 'Sid',
  maxAge: 36e5,
  overwrite: true,
  httpOnly: true,
  rolling: true,
  signed: true
}

app.use(logger())
  .use(compress({
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH
  }))
  .use(session(CONFIG, app))
  .use(static(join(__dirname, 'public')))
  .use(views(join(__dirname, 'views'), {
    extension: "pug"
  }))
  .use(body())

  

app.use(router.routes())
  .use(router.allowedMethods())
  .listen(4000, () => {
    console.log('服务器监听在 4000 端口')
  })

// 创建管理员账户
admin()