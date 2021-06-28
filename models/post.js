const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
//Passport-Local Mongoose is a Mongoose plugin that simplifies building username and password login with Passport.

const postSchema=new mongoose.Schema({
    content:{
        type:String,
        trim:true,
        required:true
        // schema validation
    },
    postedBy:{
        type:String,
        trim:true,
        required:true      
    }
})



// let create user model
const Post=mongoose.model("Post",postSchema);

module.exports=Post;
