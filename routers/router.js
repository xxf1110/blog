const Router = require('koa-router')
const user = require('../control/user')
const article = require('../control/article')

const router = new Router

// 根路由页面
router.get('/', user.keepLog,  async ctx => {
  await ctx.render('index', {
    title: 'blog',
    session: ctx.session
  })
})
// 登录、注册页面
router.get(/^\/user\/(?=reg|login)/, async ctx => {
  let path = ctx.path
  let show = (path === '/user/login') ? false : true
  await ctx.render('register', { show })
})

// 注册 
router.post('/user/reg', user.reg)
// 登录
router.post('/user/login', user.login)

// 用户退出
router.get('/user/logout', user.logout)
// 文章发表页
router.get('/article', user.keepLog, article.addPage)
// 发表文章
router.post('/article', user.keepLog, article.add)

// 个人中心页
router.get('/admin/article', async ctx => {
  await ctx.render('admin/admin')
})

module.exports = router