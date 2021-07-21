const express=require('express');
const router=express.Router()
const { isLoggedIn } = require('../middleware');
const Post=require('../models/post')
const User=require('../models/user')

//to get current user
router.get('/profile',isLoggedIn,(req,res)=>{
    const jdate=req.user.createdAt;
    date=new Date(jdate);

    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
        ];
    const month=monthNames[date.getMonth()-1]
    const year=date.getFullYear()
    const payload={
        user:req.user,
        displayName:req.user.firstName+" "+req.user.lastName,
        joiningdate:"Joined"+" "+month+" "+year,
        flag:"posts"
    }

    res.render('profile',{payload});
})


//for other users
router.get('/profile/:username',isLoggedIn,async(req,res)=>{
    const user=await User.findOne({username:req.params.username});
    const jdate=user.createdAt;
    date=new Date(jdate);

    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
        ];
    const month=monthNames[date.getMonth()-1]
    const year=date.getFullYear()
    const payload={
        user:user,
        displayName:user.firstName+" "+user.lastName,
        joiningdate:"Joined"+" "+month+" "+year,
        flag:"posts"
    }
    res.render('profile',{payload});
})








//to get current user replies
router.get('/profile/replies',isLoggedIn,(req,res)=>{
    const jdate=req.user.createdAt;
    date=new Date(jdate);
   
    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
        ];
    const month=monthNames[date.getMonth()-1]
    const year=date.getFullYear()
    const payload={
        user:req.user,
        displayName:req.user.firstName+" "+req.user.lastName,
        joiningdate:"Joined"+" "+month+" "+year,
        flag:"replies"
    }

    res.render('profile',{payload});
})


//for other users
router.get('/profile/:username/replies',isLoggedIn,async(req,res)=>{
    const user=await User.findOne({username:req.params.username});
    const jdate=user.createdAt;
    date=new Date(jdate);

    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
        ];
    const month=monthNames[date.getMonth()-1]
    const year=date.getFullYear()
    const payload={
        user:user,
        displayName:user.firstName+" "+user.lastName,
        joiningdate:"Joined"+" "+month+" "+year,
        flag:"replies"
    }
    res.render('profile',{payload});
})















module.exports=router;