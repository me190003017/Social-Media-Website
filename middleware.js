const isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        return res.redirect('./login');
    }else{
        next();
    }
}

module.exports={
    isLoggedIn
}