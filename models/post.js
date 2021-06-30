const mongoose = require('mongoose');


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
