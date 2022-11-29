let express = require('express')
let router = express.Router()
let Article = require('../modals/article')
let Comment = require('../modals/comment')

// like
router.get('/:id/likes', (req, res, next) => {
  let id = req.params.id
  Comment.findById(id, (err, comment) => {
    if (err) return next(err)
    Comment.findByIdAndUpdate(id, { $inc: { like: 1 } }, (err, comment) => {
      if (err) return next(err)
      res.redirect('/users/' + comment.articleID)
    })
  })
})

// dislike
router.get('/:id/dislike', (req, res, next) => {
  let id = req.params.id
  Comment.findById(id, (err, comment) => {
    if (err) return next(err)
    if (comment.like > 0) {
      Comment.findByIdAndUpdate(id, { $inc: { like: -1 } }, (err, comment) => {
        if (err) return next(err)
        return res.redirect('/users/' + comment.articleID)
      })
    } else {
      return res.redirect('/users/' + comment.articleID)
    }
  })
})

// delete comment
router.get('/:id/delete', (req, res, next) => {
  let id = req.params.id
  Comment.findByIdAndRemove(id, (err, article) => {
    if (err) return next(err)
    Article.findByIdAndUpdate(
      article.articleID,
      { $pull: { comments: article._id } },
      (err, article) => {
        res.redirect('/users/' + article._id)
      },
    )
  })
})

module.exports = router
