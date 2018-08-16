/**
 *  home main  router :
 */
const express = require('express') ;
const router = express.Router();
const post = require('./../../models/Post') ;
const cats = require('./../../models/Category');
const Comment = require('./../../models/Comment') ;





router.all('/*',(req,res,next)=>{

     
     req.app.locals.layout = 'home' ; 
     next() ; 
}) ;


// home
router.get('/',(req,res)=>{
    
    const current = req.query.page || 1;
 
    const prePage = 5; 
 
    post.find({status : 'public'})
        .limit(prePage)
        .skip((prePage * current) - prePage)
        .then((fposts) => {
        

             post.count().then((postCounter) => {
                 

                cats.find({}).then((cats) => {
                    
                     res.render('home/home',{
                         posts : fposts 
                         ,
                         cats :cats
                         ,
                         pages : Math.ceil(postCounter/prePage)

                         ,current : current 
                       
                        }) ;
               
                    }) ; 


             }) ; 


  
        }).catch((err) => {
        
        console.log('Error in getting Posts' + err) ;

    });
}) ;



router.post('/search',(req,res)=>{

  const search = req.body.search ;

  const promises = [
 
    cats.find({}) ,
    cats.findOne({name:search})
        .populate('posts') 
  ] ;


  Promise.all(promises).then(([cats,fcat]) => {
  
    
    if(fcat) 
    { 
        
     res.render('home/home',{cats:cats , posts:fcat.posts}) ;


      }

    else{

     //flash
        console.log('we dont have this category') ;
        return res.redirect('/') ; 
  
    }  



  }).catch((err) => {


    console.log(`Error in finding cat Posts ${err} `) ;
 
 });

}) ;







// about page
router.get('/about',(req,res)=>{
 
       const promises = [
           cats.find(),
           post.find()
       ];
      
      Promise.all(promises).then(([cats,posts])=>{
     
        res.render('home/about',{cats : cats  , posts : posts} ) ;

      }) ;

}) ;



router.get('/post/:id',(req,res)=>{
   
     const promises = [
        cats.find(),
        post.find(),
        post
        .findOne({_id : req.params.id})
        .populate({path:'comments', populate:{path:'user'}})
        .populate('user')

    ];

   Promise.all(promises).then(([cats,posts,post])=>{
   
      let num_cm = 0 ;  
     
      if (post) {
          
     for(let p_cm of post.comments){
        
                 Comment.findOne({_id : p_cm }).then((comment) => {
                     
                    if(comment.status){ 
         
                        num_cm +=1   ;
                      }
        
                 }).catch((err) => {
                    
                    console.log(`Error in findin comment in the loop ingeting single post data ${err}`) ;
                
                 });
              
               }     
        }
       
    setTimeout(function() {
        res.render('home/single',{cats:cats,posts : posts , post :post ,commment_counter:num_cm }) ; 
    }, 1000);



    }).catch(err=>{console.log('Error in bringing single Post '  + err)}) ;

}) ;








module.exports = router ;