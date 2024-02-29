const Mongoose = require("mongoose")
const UserSchema = new Mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'basic'],
    default: 'basic',
    required: true,
  },
  email:{
    type: String,
    unique: true,
  },
  first_name:{
    type: String,
    required: true,
  },
  last_name:{
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  }
},
{
  timestamps: true
})

const User = Mongoose.model("user", UserSchema)
module.exports = User