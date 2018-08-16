const express = require('express') ;
const router = express.Router();
const post = require('./../../models/Post') ;
const category =  require('./../../models/Category') ;
const comments = require('./../../models/Comment') ;
const exvalidator = require('express-validator') ;
const path = require('path') ;
const fs = require('fs') ;
const {fileUploadedDirection} = require('./../../helpers/upload-helper') ;
const {userAuthenticate}= require('./../../helpers/authenticate') ;
const user = require('./../../models/User') ;



router.all('/*',(req,res,next)=>{
    
         req.app.locals.layout = 'admin' ; 
         userAuthenticate(req,res,next);
           
    
    }) ;


// get edit page  

router.get('/edit/:id',(req,res)=>{

    post.findOne({_id : req.params.id})
         .populate('categories')
         .then((post) => {
        category.find({}).then((cats) => {
        
        
            res.render('admin/posts/edit',{ post:post , cats:cats }) ;
        
        }) ;

    }).catch((err) => {
        
        console.log(`ERROR IN FINDING POST FOR EDIT ${err}`) ;
    });



}) ;




// update post
router.put('/edit/:id',(req,res)=>{


        
    post.findOne({_id : req.params.id}).then((fpost) => {
     
     
        console.log(fpost.categories) ;
       
        fpost.categories.forEach(cat=>{
            
            category.find({_id : cat}).then((fcat) => {
                      
            
                 for (let index = 0; index < fcat[0].posts.length; index++) {
                            
                    if(  fcat[0].posts[index]  == req.params.id ){
            
                                     
                          fcat[0].posts.splice(index) ; 
                          fcat[0].save().then((result) => {
                           
                            console.log("cat saved") ;
                      
                        }).catch((err) => {
                          
                            console.log("error in cats in deleting posts "  + err ) ;
                        
                        }); ; 
                             
                       }                   
                   }       
                }) ; 
            }) ;



       category.find({}).then((cats) => {
            
          fpost.categories = [] ; 
          cats.forEach(function(cat) {       
               if(req.body[cat._id]){   
               //   console.log(req.body[cat._id]); 
                    fpost.categories.push(cat) ; 
                    cat.posts.push(fpost) ;
                    cat.save() ;

              }
          }) ;  
 
    
      }) ;
    
    
          setTimeout(function() {
            console.log(fpost.categories) ;
          }, 10);

    
    
        fpost.title = req.body.title ;
        fpost.content = req.body.content ;

         let ac = false ;

         if(req.body.allowcomment){
             ac = true ;
         }

         fpost.allowComments =  ac ;

         fpost.status = req.body.status ;

         // updating file

         let fileName = '' ;
         if(req.files.file){
 
              let file = req.files.file ;
              fileName  =   Date.now().toString() + `_` + file.name;
              
              file.mv('./public/upload/' + fileName ,(error=>{
                  if(error){
                     console.log('Error in uploading file') ;
                  }
              })) ;     
   
         }
          
         fpost.file = fileName ;

        setTimeout(function() {
           
                fpost.save().then((savedPost) => {
                    
                    
                    req.flash('success_msg',`post ${savedPost.title}  Edited SuccessFully`) ;
                        res.redirect('/admin/posts') ; 
                    
              
        
                }).catch((err) => {
                    
                    console.log( 'Error in saving post  in editing' + err) ;
                
                }) ;
        
                }, 100);

            }).catch((err) => {
            
            console.log('Error in finding the post in the put for edit' + err)
        
         });
    
 }) ;









 //deleting post

router.delete('/delete/:id',(req,res)=>{
    

    post.findOne()
        .populate('comments')
        .then((fpost) => {
        
      fs.unlink(fileUploadedDirection + fpost.file,(err)=>{


           if(err) console.log('Error in deleting file of that post' + err) ; 

           for(let cm of fpost.comments){

                cm.remove().then((result) => {
                    
                }).catch((err) => {
                    console.log('Error in deleting Comments of a deleted Post ')
                }); ;
           
            }               

            fpost.remove().then((deletedPost) => {
                
                 console.log('post deleted') ;
                 req.flash('success_msg',`post ${deletedPost.title}  deleted SuccessFully`) ;
                 res.redirect('/admin/posts') ;
            }).catch((err) => {
             
                console.log('Error in deleting Post' + err) ;
          
            });
      }) ;
  

    }).catch((err) => {
        
    });

   




         
    
}) ;



router.get('/create',(req,res)=>{
   
    category.find({}).then((fcats) => {

        res.render('admin/posts/create',{cats:fcats}) ;

    }).catch((err) => {
        console.log('Error in query Of cats in Create') ;
    });

}) ;


router.post('/create',(req,res)=>{


      category.find({}).then((cats) => {
          
        cats.forEach(function(cat) {
             
             if(req.body[cat._id]){   
             //   console.log(req.body[cat._id]); 
                newpost.categories.push(cat) ;      
                cat.posts.push(newpost) ;
                cat.save() ;
            }
        }) ;  

        newpost.save() ;
    }) ;


        
     //validation 
       const title = req.body.title ;
       const content = req.body.content ;   
       
     // console.log(title,content) ; 


       req.checkBody('title','title Needed').notEmpty() ;
       req.checkBody('content','please write an content for this post').notEmpty()

       const err = req.validationErrors();
       if(err) {
        
           return res.redirect('/admin/posts/create') ;
       }
    
      //creating 
     
     let allowcomment = false ;
     if(req.body.allowcomment) allowcomment = true ;
     
     
        // Upload
      
        let fileName = '' ;
        if(req.files.file){

             let file = req.files.file ;
             fileName  =   Date.now().toString() + `_` + file.name;
             
             file.mv('./public/upload/' + fileName ,(error=>{
                 if(error){
                    console.log('Error in uploading file') ;
                 }
             })) ;     
  
        }

      const newpost = new post({
        
                 title : req.body.title , 
                 content:req.body.content, 
                 allowComments:allowcomment
                 ,file : fileName 
                ,status:req.body.status
                ,user:req.user
        
         }); 

    
         

     setTimeout(function() {
     
        newpost.save().then((savedPost) => {
            
                console.log('Created') ;
                req.flash('success_msg',`post ${savedPost.title}  created SuccessFully`) ;
                res.redirect('/admin/posts/posts') ;
          
             }).catch((err) => {
          
                   console.log('Error' + err)  ;
            }); 
       

      },100);
}) ;



router.get('/posts',(req,res)=>{
    
     
    post.find({})
        .populate('categories')
        .populate({path:'user'})
        .then(fposts=>{    

            res.render('admin/posts/posts',{posts : fposts}) ;   
       
        }) ;

}) ;
router.get('/',(req,res)=>{
    
     
    post.find({})
       .populate('categories')
       .then(fposts=>{

        res.render('admin/posts/posts',{posts : fposts}) ;
        
      }) ;

}) ;
    
    
router.get('/myposts',(req,res)=>{
    
      post.find({user:req.user._id}).then((result) => {
          res.render('admin/posts/myPosts' , {posts:result}) ;
      }).catch((err) => {
          
      });
}) ;




module.exports = router ;