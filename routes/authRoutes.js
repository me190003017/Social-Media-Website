const express=require('express')
const router=express.Router();
const User=require('../models/user')
const passport = require('passport');


router.get('/register',(req,res)=>{
    res.render("auth/signup",{message:req.flash('error')})
})




router.post('/register', async (req,res)=>{
    try{   
         const user={
            firstName:req.body.firstname,
            lastName:req.body.lastname,
            email:req.body.email,
            username:req.body.username
         }
    const newUser=await User.register(user,req.body.password)
    res.status(200).send(newUser)
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
});



router.get('/login',(req,res)=>{
    res.render("auth/login")
})

// Login the user

router.post('/login', passport.authenticate('local',
    {
        failureRedirect: '/login',
    }), (req, res) => {
        // res.render('layouts/main_layout');
        res.redirect('/');
        console.log("login successfull");
})


// logout
router.get('/logout',(req,res)=>{
    req.logOut();
    res.redirect('/login');
})


module.exports=router;