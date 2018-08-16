const express = require('express') ;
const router = express.Router();
const post = require('./../../models/Post') ;
const Comment =  require('./../../models/Comment') ;

router.all('/*',(req,res,next)=>{
    
         
         req.app.locals.layout = 'home' ; 
         next() ; 
         
    }) ;
    



router.post('/:id',(req,res)=>{
    
      post.findOne({_id:req.params.id}).then((fpost) => {
         
      const newComment =new Comment({
          
                   user:req.user ,
                    
                   comment:req.body.comment_body
                   
                   ,post:fpost   
                   
               }) ;
          
               req.user.comments.push(newComment) ;
               req.user.save() ;
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
  module.exports = router ;
  