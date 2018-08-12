
const express = require('express') ;
const router = express.Router();
const post = require('./../../models/Post') ;
const cats = require('./../../models/Category');

router.all('/*',(req,res,next)=>{

     
     req.app.locals.layout = 'home' ; 
     next() ; 
}) ;



router.get('/catPosts/:id',(req,res)=>{

    let posts = [] ;
     cats.find({_id : req.params.id}).then((cat) => {
         

     //   console.log(cat[0]) ;


        catposts = cat[0].posts ;

       
        catposts.forEach(function(element) {
            
            //   console.log(element) ;
               post.findOne({_id : element}).then((fpost) => {
                //   console.log(fpost) ;

                   posts.push(fpost) ;
                   console.log("pushed") ;
                   
                   
               }).catch((err) => {
                   console.log('Error in showing all posts of a category') ;

               });


        }, this);

        

        
     }).catch((err) => {
         console.log(`Error in cat Posts  ${err}`) ;
     });
    
 




    cats.find({}).then((cats) => {
        
        setTimeout(function() {
            res.render('home/home',{posts:posts,cats:cats})  ;
        }, 100);
          
    }).catch((err) => {
        
    });


}) ;

router.get('/about',(req,res)=>{
 
    
       const promises = [
           cats.find(),
           post.find()
       ];
      
      Promise.all(promises).then(([cats,posts])=>{

        //code : 
        res.render('home/about',{cats : cats  , posts : posts} ) ;

      }) ;

}) ;

router.get('/',(req,res)=>{
    
    post.find({}).then((fposts) => {
        cats.find({}).then((cats) => {
        
            res.render('home/home',{posts : fposts ,cats :cats}) ;
            
        })
        
    }).catch((err) => {
        
        console.log('Error in getting Posts' + err) ;

    });
    
}) ;


router.get('/post/:id',(req,res)=>{
   
     const promises = [
        cats.find(),
        post.find(),
        post.findOne({_id : req.params.id})
    ];

   Promise.all(promises).then(([cats,posts,post])=>{

     res.render('home/single',{cats:cats,posts : posts , post :post  }) ;

   }) ;



}) ;


module.exports = router ;








