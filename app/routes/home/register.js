
const express = require('express') ;
const router = express.Router();
const exval = require('express-validator') ;
const User = require('./../../models/User') ;
const bcrypt = require('bcryptjs') ;

router.all('/*',(req,res,next)=>{
    
         
         req.app.locals.layout = 'home' ; 
         next() ; 
         
    }) ;

router.get('/',(req,res)=>{
    
    req.app.locals.layout = '' ;
    res.render('home/register') ;


}) ;


router.post('/',(req,res)=>{
    
   //res.send(`judkc`);

   // check repetive  email address 

    User.findOne({email : req.body.email}).then((user) => {
        
        if(user) {
            return res.send('the email address existed right now please check your email address')
        }
   
    });

   // validate info
   const pass  = req.body.password; 

   req.checkBody('firstName','first name cant be empty').notEmpty()  ;
 
   req.checkBody('lastName','').notEmpty()  ; 
  
   req.checkBody('email','').notEmpty()  ; 
 
   req.checkBody('email','').isEmail()   ; 
 
   req.checkBody('password','').notEmpty()   ;
 
   req.checkBody('passwordConfirm','').notEmpty()  ; 
 
   req.checkBody('passwordConfirm','').equals(pass)  ; 
  
   const  errors = req.validationErrors();

   if(errors){

    console.log(` validation Error ` ) ;
    
    req.app.locals.layout = '' ;
  
  
    return res.render('home/register',{
     
          firstName :req.body.firstName ,
        
          lastName :req.body.lastName ,
        
          email :req.body.email ,

    }) ;
    
   }

 //  console.log('any err in validation informations') ;
  

    // every  thing is ready to be best  
   const newUser = new User({

    firstName :req.body.firstName ,
  
    lastName :req.body.lastName ,
  
    email :req.body.email ,
  
    password :req.body.password ,


  }) ;


   // hashing pass :
   bcrypt.genSalt(10,(err,salt)=>{


       bcrypt.hash(newUser.password,salt).then((hash) => {
           
            newUser.password = hash ;
            
            newUser.save().then((result) => {
                
            console.log('userSaved Successfully') ;
       
            res.redirect('/login') ;   

            }).catch((err) => {

                console.log('Error in saving user to database'  + err) ;
                res.redirect('/register') ;

            });

       }).catch((err) => {
          
        
     console.log( `Error in hashing password  ${err}` ) ;


       }); 

   }) ;


}) ;


module.exports = router ;
