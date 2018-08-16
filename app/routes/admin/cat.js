
const express = require('express') ;
const router = express.Router();
const cat = require('./../../models/Category') ;
const Post = require('./../../models/Post') ;
const {userAuthenticate}= require('./../../helpers/authenticate') ;

router.all('/*',(req,res,next)=>{
    
         req.app.locals.layout = 'admin' ; 
         userAuthenticate(req,res,next);
           
    
}) ;


router.get('/',(req,res)=>{

   cat.find({}).then(fcats=>{

    res.render('admin/category/index',{cats : fcats}) ;
   }) ;

}) ;


router.get('/userAccess',(req,res)=>{
    
       cat.find({}).then(fcats=>{
    
        res.render('admin/category/category_userAccess',{cats : fcats}) ;
       }) ;
    
    }) ;
    


router.get('/create',(req,res)=>{
    
       res.render('admin/category/create') ;
      
}) ;

    

router.delete('/:id',(req,res)=>{

  
    cat.remove({ _id : req.params.id }).then((result) => {
        
        console.log(`category deleted successfuly `) ;
    
        Post.findOneAndUpdate({categories:req.params.id},{$pull:{categories:req.params.id}},
            
            (err)=>{
            
                 if(err) console.log('Error in updating categories of a post') ;
            
                }) ;

         res.redirect('/admin/categories')   ;

        }).catch((err) => {
   
        console.log(`Error in deleting category ${err} ` ) ;
   
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

