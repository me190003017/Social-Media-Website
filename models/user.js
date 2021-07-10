const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
//Passport-Local Mongoose is a Mongoose plugin that simplifies building username and password login with Passport.

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        trim:true,
        required:true
        // schema validation
    },
    lastName:{
        type:String,
        trim:true,
        required:true      
    },
    email:{
        type:String,
        trim:true,
        unique:true,
        required:true
    },
    profilePic:{
        type:String,
        default:'/images/profilePic.jpeg'
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Post'
        }
    ]

},{timestamps:true})

// look documentation
// First you need to plugin Passport-Local Mongoose into your User schema
userSchema.plugin(passportLocalMongoose);

// let create user model
const User=mongoose.model("User",userSchema);

module.exports=User;
