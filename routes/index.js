var express = require('express')
var router = express.Router()
let Article = require('../modals/article')

/* GET home page. */
router.get('/', function (req, res, next) {
  Article.find({}, (err, article) => {
    res.render('index', { article })
  })
})

module.exports = router
