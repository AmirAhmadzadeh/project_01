const users = require('./../../models/User') ;
const express = require('express') ;
const router = express.Router();
const {userAuthenticate}= require('./../../helpers/authenticate') ;



router.all('/*',(req,res,next)=>{
    
         req.app.locals.layout = 'admin' ; 
         userAuthenticate(req,res,next);
           
    
    }) ;



router.get('/',(req,res)=>{
    

      users.find({})
           .populate('comments')
           .then((fusers) => {
    
        res.render('admin/users/users',{users:fusers}) ;

      }).catch((err) => {
       
        console.log('Error in finding users in admin panel') ;
       
    });
}) ;




router.get('/yourInfo',(req,res)=>{

res.render('admin/users/userInfo')  ; 



}) ;

router.get('/yourInfo/edit',(req,res)=>{
  

  res.render('admin/users/updateInfo') ; 
  

  
  }) ;
  
router.put('/yourInfo/edit/:id',(req,res)=>{



 users.findOne({_id : req.params.id}).then((fuser) => {
   
           fuser.firstName = req.body.firstName ; 
           fuser.lastName = req.body.lastName ;
           fuser.email =  req.body.email ; 
           fuser.save().then((result) => {
   
                res.render('admin/users/userInfo',{user:fuser} ) ; 
                
           }).catch((err) => {
            
            console.log('Error in saving user in the Updating info') ;
          
          }); 
           

    }).catch((err) => {
      console.log('Error in updating user info') ;
    });


}) ;

router.delete('/delete/:id',(req,res)=>{
 
     
   users.findOne({_id : req.params.id , status : 'user'})
        .populate('comments')  
        .then((fuser) => {
     
             for(let cm of fuser.comments){

                cm.remove().then((result) => {
                  
                }).catch((err) => {
                  console.log('Error in deleting Comments Of user in users router' + err)  ;
                
                });           
              }
                 
             fuser.remove().then((result) => {
               
                res.redirect('/admin/users') ;
               
             }).catch((err) => {
           

              console.log('**  Error ** ' + err) ;      

             });


   }).catch((err) => {
      
       console.log('Error in finding /user ') ; 
   });



}) ;


module.exports = router ;
