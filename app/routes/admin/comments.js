/**
 * 
 * comments router
 */

const express = require('express') ;
const router = express.Router();
const post  = require('./../../models/Post') ;
const Comments = require('./../../models/Comment') ;
const {userAuthenticate}= require('./../../helpers/authenticate') ;

router.all('/*',(req,res,next)=>{
    
         req.app.locals.layout = 'admin' ; 
         userAuthenticate(req,res,next);
           
    
    }) ;

router.delete('/remove/:id',(req,res)=>{

    
     Comments.remove({_id:req.params.id}).then((deletedComment) => {        
         
    


       post.findOneAndUpdate({

        comments : req.params.id 
       },
       {
           $pull:{comments:req.params.id}
       },(err)=>{

           if(err) console.log('Error in deleting Comment from the post') ;

     
        }
     
      ) ;
      req.flash('success_msg',`comment  deleted SuccessFully`) ;   
      
      res.redirect('/admin/comments') ;  

     }).catch((err) => {

        console.log("Error in removing comment 0" + err) ;
    
    });
});




router.get('/status/:id',(req,res)=>{
    
    
      Comments.findOne({_id : req.params.id }).then((fcomment) => {
          
                if(fcomment.status){

                    fcomment.status = false ;
                    fcomment.save() ;
                    return res.redirect('/admin/comments') ;
                } else{

                    fcomment.status =  true ;
                    fcomment.save() ;
                    return res.redirect('/admin/comments') ;
                }

      }).catch((err) => {
        
         console.log( ` Error in finding commment for changing status  ${err} `) ;
      });
       
     
  
  
  })
  
  
  

router.get('/',(req,res)=>{
  
     Comments.find({})
      .populate({path:'user'})
      .then((fcomments) => {
         

        res.render('admin/comments/comments',{comments:fcomments}) ;

     }).catch((err) => {
      
        console.log(' Error in finding Comments  in the admin Panel' + err) ;
     
    });
  

}) ; 

router.get('/myComments',(req,res)=>{
    
       Comments.find({user:req.user._id})
        .populate({path:'user'})
        .then((fcomments) => {
           
  
          res.render('admin/comments/myComments',{comments:fcomments}) ;
  
       }).catch((err) => {
        
          console.log(' Error in finding Comments  in the admin Panel' + err) ;
       
      });
    
  
  }) ; 



module.exports = router ;
    
    
