const express=require('express');
const router=express.Router()
const { isLoggedIn } = require('../../middleware');
const Post=require('../../models/post')
const User=require('../../models/user')

// To get all posts
router.get('/api/post',isLoggedIn,async(req,res)=>{
    // console.log(req.query)
    const filter=req.query;
    const results=await Post.find(filter).populate('postedBy').populate('replyTo');
    posts=await User.populate(results,{path:"replyTo.postedBy"});
    res.json(posts);
})
// get post that id
router.get('/api/posts/:id',isLoggedIn,async(req,res)=>{
    const result=await Post.findById(req.params.id).populate('postedBy').populate('replyTo');
    post=await User.populate(result,{path:"replyTo.postedBy"});
    res.json(post);
})


// To add new post
router.post('/api/post',isLoggedIn,async(req,res)=>{
    let post={
        content:req.body.content,
        postedBy:req.user
    }
    if(req.body.replyTo){
        post={
            ...post,
            replyTo:req.body.replyTo
        }
        // console.log("reply to "+req.body.replyTo)
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

router.get('/profile/user',async(req,res)=>{
    // console.log(req.query)
    const filter=req.query.postedBy;
    // console.log(filter)
    const result=await User.findById(filter).populate('likes') ; 
    // posts=await User.populate(results,{path:"replyTo.postedBy"});
    // console.log(result)
    res.json(result);
})

module.exports=router;