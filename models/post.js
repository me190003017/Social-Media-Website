const mongoose = require('mongoose');


const postSchema=new mongoose.Schema({
    content:{
        type:String,
        trim:true,
        required:true
        // schema validation
    },
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'     
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    replyTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }
},{timestamps:true})



// let create user model
const Post=mongoose.model("Post",postSchema);

module.exports=Post;
