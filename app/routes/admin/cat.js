
const express = require('express') ;
const router = express.Router();
const cat = require('./../../models/Category') ;

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

