/**
 * 
 * comments router
 */

const express = require('express') ;
const router = express.Router();
const post  = require('./../../models/Post') ;
const comments = require('./../../models/Comment') ;

router.all('/*',(req,res,next)=>{
    
         req.app.locals.layout = 'admin' ; 
         next() ; 
}) ;
    


router.delete('/remove/:id',(req,res)=>{

    
     comments.findOne({_id:req.params.id}).then((fcomment) => {        
         
        //  console.log(fcomment.post) ;
          post.findOne({ _id:fcomment.post }).then((fpost) => {
              
             // console.log(fpost.comments);
               for (var index = 0; index < fpost.comments.length; index++) {
                   
                  //  console.log(fpost.comments[index] );
                      
                      if(fpost.comments[index] == req.params.id){

                        console.log("yes") ;

                        fpost.comments.splice(index) ;
                        fpost.save();
                        
                        fcomment.remove().then((result) => {
                            

                            return res.redirect('/admin/comments') ;

                        }).catch((err) => {
                            
                            console.log("Error in removing comment" + err) ;
                        });

                      }                     
               } 

           }).catch((err) => {
              
           });  










     }).catch((err) => {
        
        
     });


} )





router.get('/',(req,res)=>{
  
     comments.find({})
      .populate({path:'user'})
     .then((fcomments) => {
         

        res.render('admin/comments/comments',{comments:fcomments}) ;

     }).catch((err) => {
      
        console.log(' Error in finding Comments  in the admin Panel' + err) ;
     
    });
  
   


})














module.exports = router ;
    
    
