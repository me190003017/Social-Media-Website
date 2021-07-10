const express=require('express');
const router=express.Router()
const { isLoggedIn } = require('../../middleware');
const Post=require('../../models/post')
const User=require('../../models/user')

// To get all posts
router.get('/api/post',isLoggedIn,async(req,res)=>{
    const posts=await Post.find({}).populate('postedBy');
    res.json(posts);
})


// To add new post
router.post('/api/post',isLoggedIn,async(req,res)=>{
    const post={
        content:req.body.content,
        postedBy:req.user
    }
    // new post created and added to dataset
    const newPost=await Post.create(post)
  
    res.json(newPost)
})

router.patch('/api/posts/:id/like',isLoggedIn,async(req,res)=>{
   const postId=req.params.id;
   const userId=req.user._id;
    // we are checking whether this user already liked or not
    const isLiked=req.user.likes&&req.user.likes.includes(postId);
    // if liked then use pull method to remove and not liked than add post to current user's likes list
    const option=isLiked?'$pull':'$addToSet';
    req.user=await User.findByIdAndUpdate(userId,{[option]:{likes:postId}});
    // Now same work for post
    const post=await Post.findByIdAndUpdate(postId,{[option]:{likes:userId}});
    res.status(200).json(post);
})

module.exports=router;