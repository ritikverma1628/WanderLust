const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    }
})
// What this plugin does internally?
// It automatically adds:

// ✅ Fields
// username
// hash
// salt

// ✅ Methods
// register()
// authenticate()
// setPassword()
// changePassword()

userSchema.plugin(passportLocalMongoose);   //passport local mongoose itself add fields like username, hashed passwords and salting and hashing

const User = mongoose.model('User',userSchema);

module.exports = User;