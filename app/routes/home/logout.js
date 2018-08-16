const express = require('express') ; 

const router =  express.Router()  ;

const user = require('./../../models/User') ;



router.get('/',(req,res)=>{
    

      req.logOut() ;
      res.redirect('/login') ;       
    
    
 }) ;


router.delete('/deleteAccount',(req,res)=>{
  
 
    

      user.remove({_id : req.user._id ,status:'user' }).then((result) => {
       
         
         console.log("accont deleted successfully")  ;    
         res.redirect('/register') ;

      }).catch((err) => {
         
        console.log("Error  in deleting Accont of a user")  ;    
       
     });
}) ; 






    

 module.exports = router ;   