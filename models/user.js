const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    }
})
userSchema.plugin(passportLocalMongoose);   //passport local mongoose itself add fields like username, hashed passwords and salting and hashing

module.exports = mongoose.model('User',userSchema);