const Koa = require('koa')
const static = require('koa-static')
const views = require('koa-views')
const  { join } = require('path')
const logger = require('koa-logger')  
const body = require('koa-body')
const router = require('./routers/router')
const app = new Koa



// app.use(logger())
app.use(static(join(__dirname, 'public')))
app.use(views(join(__dirname, 'views'), {
    extension: "pug"
  }))
app.use(body())



app.use(router.routes())
  .use(router.allowedMethods())


app.listen(4000, () => {
  console.log('服务器监听在 4000 端口')
})