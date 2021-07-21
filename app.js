const express = require('express');
const app = express();

const mongoose = require('mongoose');
const path = require('path');

const session = require('express-session')
const passport = require('passport');
const User=require('./models/user')
const LocalStrategy = require('passport-local');
const { isLoggedIn } = require('./middleware');
const flash = require('connect-flash');


mongoose.connect('mongodb://localhost:27017/twitter-clone', 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify:false,
        useCreateIndex:true
    })
    .then(()=>console.log('DB connected'))
    .catch((err)=>console.log(err));

// set template engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'))

// public folder is place for static files
app.use(express.static(path.join(__dirname,'/public')))
app.use(express.urlencoded({extended:true}))//middleware used for parse the body
app.use(express.json()) // to parse json data

// Routes 
const authRouters=require('./routes/authRoutes')
const profileRouter=require('./routes/profile')
// APIs
const postsApiRoute=require('./routes/api/post')

// Note Session data is not saved in the cookie itself, just the session ID. Session data is stored server-side.

app.use(session({
    secret: 'twiter secret',
    resave: false,
    saveUninitialized: true
  }))


app.use(flash());
app.use(passport.initialize());
app.use(passport.session())


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})
app.get('/',isLoggedIn,(req,res)=>{
    res.render("layouts/main_layout");
})


app.use(authRouters)

// using apis
app.use(postsApiRoute)
app.use(profileRouter)

app.listen(3003,()=>{
    console.log('app is listening on 3003 port'+'\nclick here http://localhost:3003/')
})
