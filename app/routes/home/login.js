

const express = require('express') ;
const router = express.Router();
const {setStrategy,setConfig} =  require('./../../passport/pass')
const exval = require('express-validator') ;
const passport = require('passport') ;
const LocalStrategy = require('passport-local').Strategy ;




router.get('/',(req,res)=>{
    req.app.locals.layout = '' ; 
    res.render('home/login' ) ;

}) ;


passport.use('local',new LocalStrategy(
    {usernameField : 'email'}, 
   
    (email,password,done)=>{
        setStrategy(email,password,done) ;
    }

 ));





router.post('/',(req,res,next)=>{
    


    req.checkBody('email').notEmpty()  ;
    req.checkBody('email').isEmail()  ;
    req.checkBody('password').notEmpty();

    if(req.validationErrors()){

        return res.send('validation Error') ;
    }

  setConfig() ;
  
  passport.authenticate('local',{
    
             successRedirect : '/admin'
            ,failureRedirect : '/login',
           })(req,res,next) ;
    
}) ;


module.exports = router ;
