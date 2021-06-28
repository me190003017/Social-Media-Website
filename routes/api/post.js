const express=require('express');
const { post } = require('../authRoutes');
const router=express.Router();
const Post=require('../models/post')
const {isLoggedIn} = require('./middleware')
// to get all the posts
router.get('/api/post',async(req,res)=>{
    const posts=await Post.find({});
    res.json(posts);
})


// to add new post

router.post('/api/post',isLoggedIn,async(req,res)=>{
    const post={
        content:req.body.content,
        postedBy:req.body.username
    }

    const newPost=await Post.create(post);
    res.json(newPost)
})


module.exports=post;