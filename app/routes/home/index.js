/**
 *  home main  router :
 */
const express = require('express') ;
const router = express.Router();
const post = require('./../../models/Post') ;
const cats = require('./../../models/Category');
const exval = require('express-validator') ;
const User = require('./../../models/User') ;
const bcrypt = require('bcryptjs') ;
const passport = require('passport') ;
const LocalStrategy = require('passport-local').Strategy ;
const {setStrategy,setConfig} =  require('./../../passport/pass')
const Comment = require('./../../models/Comment') ;


router.all('/*',(req,res,next)=>{

     
     req.app.locals.layout = 'home' ; 
     next() ; 
     
}) ;


router.post('/Comment/:id',(req,res)=>{
   post.findOne({_id:req.params.id}).then((fpost) => {
       

    

    const newComment =new Comment({
        
                 user:req.user ,
                  
                 comment:req.body.comment_body
                 
                 ,post:fpost   
                 
             }) ;
        
            newComment.save().then((result) => {
                
               console.log(' comment saved ') ; 
               
               fpost.comments.push(newComment) ;
               
               fpost.save()
               
               res.redirect(`/post/${req.params.id}`);
               
            }).catch((err) => {
                
                console.log('Error in saving comments' + err) ;
        
            });

    

   }).catch((err) => {
       
    console.log(`Error in finding post in Comment Router ${err}`)
   });



}) ;



router.get('/login',(req,res)=>{
    req.app.locals.layout = '' ; 
    res.render('home/login' ) ;

}) ;


passport.use('local',new LocalStrategy(
    {usernameField : 'email'}, 
   
    (email,password,done)=>{
        setStrategy(email,password,done) ;
    }

 ));





router.post('/login',(req,res,next)=>{
    


    req.checkBody('email').notEmpty()  ;
    req.checkBody('email').isEmail()  ;
    req.checkBody('password').notEmpty();

    if(req.validationErrors()){

        return res.send('validation Error') ;
    }

  //  console.log('Info seems good ') ;
  setConfig() ;
  
  passport.authenticate('local',{
    
             successRedirect : '/admin'
            ,failureRedirect : '/login',
           })(req,res,next) ;
    
}) ;




router.get('/register',(req,res)=>{
    
    req.app.locals.layout = '' ;
    res.render('home/register') ;


}) ;


router.post('/register',(req,res)=>{
    
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



router.get('/about',(req,res)=>{
 
       const promises = [
           cats.find(),
           post.find()
       ];
      
      Promise.all(promises).then(([cats,posts])=>{
     
        res.render('home/about',{cats : cats  , posts : posts} ) ;

      }) ;

}) ;


// home
router.get('/',(req,res)=>{
    
    post.find({status : 'public'}).then((fposts) => {
        cats.find({}).then((cats) => {
            
    
             res.render('home/home',{posts : fposts ,cats :cats}) ;
            
        }) ;
        
    }).catch((err) => {
        
        console.log('Error in getting Posts' + err) ;

    });
    
}) ;


router.get('/post/:id',(req,res)=>{
   
     const promises = [
        cats.find(),
        post.find(),
        post
        .findOne({_id : req.params.id})
        .populate({path:'comments', populate:{path:'user'}})
        .populate('user')

    ];

   Promise.all(promises).then(([cats,posts,post])=>{
   
      let num_cm = post.comments.length ;  
      res.render('home/single',{cats:cats,posts : posts , post :post ,commment_counter:num_cm }) ;
 
    }) ;
}) ;


module.exports = router ;








