/**
 * 
 * Application 
 */

const express = require('express') ;
const mongoose = require('mongoose') ;
const exhandlebars = require('express-handlebars') ;
const bodyParser = require('body-parser') ;
const expressValidator = require('express-validator');
const {generateTime,select,check,content_summery_side,content_summery_posts,content,cm_counter,deleteBtn,paginate} = require('./helpers/helper-handlebars') ;
const expresUpload = require('express-fileupload') ;
const methodOverRide =  require('method-override') ;
const http = require('http') ;
const session = require('express-session') ;
const passport = require('passport') ;
const cookieParser = require('cookie-parser') ;
const flash = require('connect-flash') ;


const app = express() ;

module.exports = class Application {

   constructor(){

      this.setexpress()  ;
      this.setMongo() ;
      this.setConfig() ;
      this.setOtherMiddlewares() ;
      this.setTemplateEngine();
      this.setrouteMiddlewares();

   }
 
   setexpress(){


     const server = http.createServer(app) ;
     const port = process.env.PORT || 3000 ;
     server.listen(port, (err)=>{

        if(err) console.log('Error in creating server ') ;
        else {
          console.log(`Server is running on port ${port}`) ;
        }
      }) ; 

  
   } 

   setMongo(){

      mongoose.connect( process.env.MONGODB_URI || 'mongodb://localhost:27017/project02' , (err=>{
        
              if(err)  console.log("Error in connection to the database");
      
              else {
                console.log('connected to db') ;
              }
        
            })) ;
  
     }
  
   setConfig(){

          app.use(express.static('public')) ;
          // body-parser middlewares :
          app.use(bodyParser.json());
          app.use(bodyParser.urlencoded({extended:true})) ;
          // middleware for validation
          app.use(expressValidator({
       
              errorFormatter: function(param, msg, value) {
                  let namespace = param.split('.')
                      , root    = namespace.shift()
                      , formParam = root;
            
                  while(namespace.length) {
                    formParam += '[' + namespace.shift() + ']';
                  }
                  return {
                    param : formParam,
                    msg   : msg,
                    value : value
                  };
              }
          }));

          //file Uploading MiddleWares : 
          app.use(expresUpload()) ;
          
          //method Over Ride
          app.use(methodOverRide('_method')) ;


          // cookie-parser
           app.use(cookieParser()) ;


          //session 

            app.use(session({
            
            secret:"Amir" , resave:true  ,saveUninitialized : true    

            })) ;
          
            app.use(session()) ;
 
         // passport : 

           app.use(passport.initialize()) ;
           app.use(passport.session()) ;
        
  }


  setTemplateEngine(){

     app.engine('handlebars' , exhandlebars({helpers : {

      generateTime : generateTime
      ,
       select : select  ,
       check : check ,
       content_summery_side : content_summery_side ,
       content_summery_posts: content_summery_posts,
       content : content,
       cm_counter :cm_counter , 
       deleteBtn : deleteBtn,
       paginate:paginate
     
    }}));
     app.set('view engine','handlebars') ;

  }

  setOtherMiddlewares(){

     app.use(flash()) ;
      app.use((req,res,next)=>{

       res.locals.user = req.user || null ;
       res.locals.success_msg = req.flash('success_msg') ;                
       res.locals.register_msg = req.flash('register_msg') ;
       res.locals.register_msg = req.flash('error');
      
       next() ;
    

      }) ;
  } 
  
  setrouteMiddlewares(){

    // home middlewares  : 
    app.use('/',require('./routes/home/index'));
    app.use('/catPosts',require('./routes/home/category')) ;
    app.use('/register',require('./routes/home/register'));
    app.use('/Comment',require('./routes/home/comment')) ; 
    app.use('/login',require('./routes/home/login')) ; 
    app.use('/logout',require('./routes/home/logout')) ;

    
    // admin middlewares
    app.use('/admin',require('./routes/admin/index'));
    app.use('/admin/posts',require('./routes/admin/posts'));    
    app.use('/admin/categories',require('./routes/admin/cat'))
    app.use('/admin/comments',require('./routes/admin/comments')) ;
    app.use('/admin/users',require('./routes/admin/users')) ;
    
  }





}


