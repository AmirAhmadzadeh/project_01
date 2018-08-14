/**
 * 
 *  admin router
 * 
 */
const express = require('express') ;
const router = express.Router();
const users = require('./../../models/User') ;
const {userAuthenticate}= require('./../../helpers/authenticate') ;


router.all('/*',(req,res,next)=>{

     req.app.locals.layout = 'admin' ; 
     userAuthenticate(req,res,next);
       

}) ;


router.get('/dashbord',(req,res)=>{
    
    
        res.render('admin/admin') ;
    
    
 }) ;




router.get('/',(req,res)=>{


    res.render('admin/admin') ;


}) ;



router.get('/users',(req,res)=>{
    

      users.find({}).then((fusers) => {
    
        res.render('admin/users/users',{users:fusers}) ;

      }).catch((err) => {
       
        console.log('Error in finding users in admin panel') ;
       
    });
    
    
}) ;



module.exports = router ;



