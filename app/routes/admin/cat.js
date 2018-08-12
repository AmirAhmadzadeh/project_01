
const express = require('express') ;
const router = express.Router();
const cat = require('./../../models/Category') ;
const Post = require('./../../models/Post') ;
router.all('/*',(req,res,next)=>{

     req.app.locals.layout = 'admin' ; 
     next() ; 
}) ;



router.get('/',(req,res)=>{

   cat.find({}).then(fcats=>{

    res.render('admin/category/index',{cats : fcats}) ;
   }) ;

}) ;



router.get('/create',(req,res)=>{
    
       res.render('admin/category/create') ;
      
}) ;

    

router.delete('/:id',(req,res)=>{

  
    cat.remove({ _id : req.params.id }).then((result) => {
        

        console.log(`category deleted successfuly `) ;


    }).catch((err) => {
   
        console.log(`Error in deleting category ${err} ` ) ;
   
    });
    

    Post.find({}).then((posts) => {
        
     posts.forEach(post=>{
 
 
          console.log(post.categories) ;
       
 
          for (var index = 0; index < post.categories.length; index++) {
             
 
             console.log(post.categories[index]) ;
 
             if(post.categories[index] == req.params.id){
 
                 console.log('founded   :D ') ;
                 post.categories.splice(index) ;

                 cat.find({}).then((cats) => {
                     
                    return res.render('admin/category/index',{cats:cats}) ; 
              
                }) ;
 
             }
              
          }
 
     }) ;
 
 
    }).catch((err) => {
        
        console.log('Error in finding posty for splicing special category' + err) ;
    });

 

}) ; 




router.post('/create',(req,res)=>{
    

    if(!req.body.catname  || req.body.catname.length <3 ){
        return res.redirect('/admin/categories/create') ;
    }
   
    const newcat = new cat({

            name : req.body.catname 
       }) ;


       newcat.save().then((result) => {
           
            res.redirect("/admin/categories") ;
       }).catch((err) => {
           console.log('Error in saving category') ;
       }); ;
    
    }) ;
    

    


module.exports = router ;

