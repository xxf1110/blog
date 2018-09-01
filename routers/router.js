const Router = require('koa-router')
const user = require('../control/user')
const router = new Router

// 根路由页面
router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'blog'
  })
})
// 登录、注册页面
router.get(/^\/user\/(?=reg|login)/, async (ctx, next) => {
  let path = ctx.path
  let show = (path === '/user/login') ? false : true
  await ctx.render('register', { show })
})

// 注册 
router.post('/user/reg', user.reg)
// 登录
router.post('/user/login', user.login)


module.exports = router