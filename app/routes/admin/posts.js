const express = require('express') ;
const router = express.Router();
const post = require('./../../models/Post') ;
const category =  require('./../../models/Category') ;
const exvalidator = require('express-validator') ;
const path = require('path') ;
const fs = require('fs') ;



router.all('/*',(req,res,next)=>{

     req.app.locals.layout = 'admin' ; 
     next() ; 
}) ;


//deleting post

router.delete('/delete/:id',(req,res)=>{
     
    
    const dir =  "C:\\Users\\HP\\Desktop\\node\\project02\\public\\upload\\" ;

    post.findOne({_id : req.params.id}).then(fpost=>{
         
       

        if(fpost.file != ''){

            fs.unlink( dir + fpost.file ,(err)=>{
                
                if(err) console.log(err)  


            fpost.remove()
            .then(deletedPost=>{
                
                console.log('Deleted Successfully') ;
                return res.redirect('/admin/posts') ; 

            }).catch(err=>{
        
                if(err) console.log('Error in  Deleting Post') ;

            }) ; 
        });
    }else{


    fpost.remove()
    .then(deletedPost=>{
        
        console.log('Deleted Successfully') ;
        return res.redirect('/admin/posts') ; 

    }).catch(err=>{

        if(err) console.log('Error in  Deleting Post') ;

    }) ; 

   }
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
                console.log(req.body[cat._id]); 
                newpost.categories.push(cat) ;      
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
         //  console.log('valid info for creating the Post') ;
           return res.redirect('/admin/posts/create') ;
       }
    
     //creating :
     
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
        
         }); 

    
        

     newpost.save().then((result) => {
     
        console.log('Created') ;
         res.redirect('/admin/posts/posts') ;
   
      }).catch((err) => {
   
            console.log('Error' + err)  ;
     }); 

}) ;



router.get('/posts',(req,res)=>{
    
     
    post.find({})
        .populate('categories')
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
    
        res.render('admin/posts/posts') ;
}) ;




module.exports = router ;