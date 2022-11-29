let mongoose = require('mongoose')
let bcrypt = require('bcrypt')
let Schema = mongoose.Schema
let userSchema = new Schema(
  {
    firstName: { type: String, requred: true },
    lastName: { type: String },
    email: { type: String, requred: true, unique: true },
    password: { type: String, required: true, minlength: 5 },
    city: { type: String, required: true },
  },
  { timestamps: true },
)

userSchema.pre('save', function (next) {
  if (this.password && this.isModified('password')) {
    bcrypt.hash(this.password, 10, (err, hashed) => {
      if (err) return next(err)
      console.log(hashed)
      this.password = hashed
      return next()
    })
  }
})

userSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result)
  })
}



module.exports = mongoose.model('User', userSchema)
