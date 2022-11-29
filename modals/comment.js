let mongoose = require('mongoose')
let Article = require('../modals/article')
let Schema = mongoose.Schema

let commentSchema = new Schema(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
    date: {
      type: String,
      default: new Date().toLocaleDateString(),
      require: true,
    },
    articleID: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
    like: { type: Number, default: 0 },
    dislike: { type: Number },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Comment', commentSchema)
