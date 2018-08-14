const cats = require('./../../models/Category') ;
const post = require('./../../models/Post') ;
const express = require('express') ;
const router = express.Router();



router.get('/:id',(req,res)=>{
    
         let posts = [] ;
         cats.findOne({_id : req.params.id}).then((cat) => {
            
                for(let postId of cat.posts){
                    
                        post.findOne({_id : postId}).then((fpost) => {
                          
                            if(fpost && fpost.status == 'public')   posts.push(fpost) ;
                                               
                        }).catch((err) => {
                           
                            console.log('Error in showing all posts of a category' + err ) ;
            
                        });
                    } 
                      
               
            
         }).catch((err) => {
             console.log(`Error in cat Posts  ${err}`) ;
         });
        
     
        cats.find({}).then((cats) => {
            
            setTimeout(function() {
    
                res.render('home/home',{posts:posts,cats:cats})  ;
            }, 1000);   

        }).catch((err) => {
           
            console.log('Error3 in showing all posts of a category' + err ) ;
        
        });
   
    }) ;




    module.exports = router ;
    