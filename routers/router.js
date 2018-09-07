const Router = require('koa-router')
const user = require('../control/user')
const article = require('../control/article')
const comment = require('../control/comment')
const admin = require('../control/admin')
const upload = require('../util/upload')
const router = new Router


// 根路由页面
router.get('/', user.keepLog, article.getList)

// 文章显示
router.get('/page/:id', user.keepLog, article.getList)

// 登录、注册页面
router.get(/^\/user\/(?=reg|login)/, user.userPage)

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

// 文章详情页
router.get('/article/:id', user.keepLog,  article.details)

// 发表评论
router.post('/comment', user.keepLog, comment.save)

// 个人中心页
router.get('/admin/:id', user.keepLog, admin.admin)

// 头像上传
router.post('/upload', user.keepLog, upload.single('file'), user.upload)

// 获取所有评论
router.get('/user/comments', user.keepLog, comment.getCom)

// 删除评论
router.del('/comment/:id', user.keepLog, comment.del)

// 获取所有文章
router.get('/user/articles', user.keepLog, article.getArt)

// 删除文章
router.del('/article/:id', user.keepLog, article.del)

// 获取所有用户
router.get('/user/users', user.keepLog, user.getUsers)

// 删除用户
router.del('/user/:id', user.keepLog, user.del)






// 404
router.get('*', async ctx => {
  await ctx.render('404', {
    title: '404'
  })
})


module.exports = router