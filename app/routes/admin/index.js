/**
 * 
 *  admin router
 * 
 */
const express = require('express') ;
const router = express.Router();
const users = require('./../../models/User') ;
const Post = require('./../../models/Post') ;
const cat = require('./../../models/Category') ;
const Comment = require('./../../models/Comment') ;
const {userAuthenticate}= require('./../../helpers/authenticate') ;
const faker  = require('faker') ;

router.all('/*',(req,res,next)=>{

     req.app.locals.layout = 'admin' ; 
     userAuthenticate(req,res,next);
       

}) ;

router.post("/generate-random-post",(req,res)=>{
    

    for(let i=0 ; i<req.body.amount ; i++){
       // let dirupload = './public/uploads/' ;        
       // let filename  = 'code-1839406_1920.jpg' ;
        const newpost = new Post({
            
            title : faker.name.title(),
            content : faker.lorem.text(),
            status :  'public'  , 
            allowComments:faker.random.boolean()  ,
            comments: [] ,
            user : req.user    
            
        }) ;
        
       
     //   newpost.file = filename ;       
       
        newpost.save().then((result) => {
             
          //   console.log('Created Posts Successfully') ;
       
         }).catch((err) => {
            
            console.log('Error In Creating Post RandomLy' + err) ;

        }); ; 
        
    
    }
    res.redirect('/admin/posts') ;

}) ;


router.get('/dashbord',(req,res)=>{
    

      const promises = [
          Post.count()
          ,Comment.count()
          ,cat.count()
          ,users.count()
      ] ;

     Promise.all(promises).then(([posts,comments,cats,users]) => {
         
        res.render('admin/admin',{posts:posts,cats:cats,users:users,comments:comments}) ;
    

     }).catch((err) => {
         
     }); ;
    
    
    
 }) ;




router.get('/',(req,res)=>{


 
    const promises = [
        Post.count()
        ,Comment.count()
        ,cat.count()
        ,users.count()
    ] ;

   Promise.all(promises).then(([posts,comments,cats,users]) => {
       
      res.render('admin/admin',{posts:posts,cats:cats,users:users,comments:comments}) ;
  

   }).catch((err) => {
       
   }); ;
  


}) ;






module.exports = router ;



