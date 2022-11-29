var express = require('express')
var router = express.Router()
let User = require('../modals/user')
let Article = require('../modals/article')
let Comment = require('../modals/comment')
const { response } = require('express')
const article = require('../modals/article')
const { Cookie } = require('express-session')

/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log(req.session)
  Article.find({}, (err, article) => {
    return res.render('user', { article })
  })
})

// registration

router.get('/registration', (req, res, next) => {
  res.render('registeration')
})

router.post('/registration', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) return next(err)
    return res.redirect('/users/login')
  })
})
// login
router.get('/login', (req, res, next) => {
  let error = req.flash('error')
  return res.render('login', { error })
})
router.post('/login', (req, res, next) => {
  let { email, password } = req.body
  if (!email || !password) {
    req.flash('error', 'email / password is required!')
    return res.redirect('/users/login')
  }

  User.findOne({ email }, (err, user) => {
    // no user
    if (err) return next(err)
    if (!user) {
      req.flash('error', 'email  is invalid')
      return res.redirect('/users/login')
    }
    // password compare
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err)
      if (!result) {
        req.flash('error', 'Password is invalid')
        return res.redirect('/users/login')
      }
      // persists loged information
      req.session.userId = user.id
      return res.redirect('/users')
    })
  })
})

router.get('/logout', (req, res, next) => {
  req.session.destroy()
  res.clearCookie('connect.sid')
  res.redirect('/')
})
// new blog
router.get('/new', (req, res, next) => {
  res.render('newblog')
})

// handle new blog
router.post('/', (req, res, next) => {
  Article.create(req.body, (err, article) => {
    if (err) return next(err)
    console.log(article)
    return res.redirect('/users')
  })
})

// find singal page

router.get('/:id', (req, res, next) => {
  let id = req.params.id
  Article.findById(id)
    .populate('comments')
    .exec((err, article) => {
      return res.render('singalarticle', { article })
    })
})

// likes
router.get('/:id/likes', (req, res, next) => {
  let id = req.params.id
  Article.findByIdAndUpdate(
    id,
    { $inc: { likes: 1 } },
    { new: true },
    (err, article) => {
      if (err) return next(err)
      return res.redirect('/users/' + id)
    },
  )
})

// update article

router.get('/:id/edit', (req, res, next) => {
  let id = req.params.id
  Article.findById(id, (err, article) => {
    if (err) return next(err)
    return res.render('updateblog', { article })
  })
})

// submit update article
router.post('/:id', (req, res, next) => {
  let id = req.params.id
  Article.findByIdAndUpdate(id, req.body, { new: true }, (err, article) => {
    if (err) return next(err)
    return res.redirect('/users/' + id)
  })
})

// delete article
router.get('/:id/delete', (req, res, next) => {
  let id = req.params.id
  Article.findByIdAndDelete(id, (err, article) => {
    if (err) return next(err)
    Comment.deleteMany({ articleID: article.id }, (err, article) => {
      res.redirect('/users')
    })
  })
})

// dislike
router.get('/:id/dislike', (req, res, next) => {
  let id = req.params.id
  Article.findById(id, (err, article) => {
    if (article.likes > 0) {
      Article.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, article) => {
        if (err) return next(err)
        return res.redirect('/users/' + id)
      })
    } else {
      return res.redirect('/users/' + id)
    }
  })
})
// create a comment
router.post('/:id/comments', (req, res, next) => {
  let id = req.params.id
  req.body.articleID = id
  Comment.create(req.body, (err, comment) => {
    if (err) return next(err)
    Article.findByIdAndUpdate(
      id,
      { $push: { comments: comment._id } },
      { new: true },
      (err, article) => {
        res.redirect('/users/' + id)
      },
    )
  })
})



module.exports = router
