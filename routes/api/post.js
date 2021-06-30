const express=require('express');
const router=express.Router()
const { isLoggedIn } = require('../../middleware');
const Post=require('../../models/post')


// To get all posts
router.get('/api/post',isLoggedIn,async(req,res)=>{
    const posts=await Post.find({});
    res.json(posts);
})


// To add new post
router.post('/api/post',isLoggedIn,async(req,res)=>{
    const post={
        content:req.body.content,
        postedBy:req.user.username
    }
    // new post created and added to dataset
    const newPost=await Post.create(post)
  
    res.json(newPost)
})

module.exports=router;