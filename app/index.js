const express = require('express') ;
const mongoose = require('mongoose') ;
const exhandlebars = require('express-handlebars') ;
const bodyParser = require('body-parser') ;
const expressValidator = require('express-validator');
const {generateTime,select,check,content} = require('./helpers/helper-handlebars') ;
const expresUpload = require('express-fileupload') ;
const methodOverRide =  require('method-override') ;
const http = require('http') ;

const app = express() ;

module.exports = class Application {


   constructor(){

      this.setexpress()  ;
      this.setMongo() ;
      this.setConfig() ;
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

      mongoose.connect('mongodb://localhost:27017/project02' , (err=>{
        
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
 
  }


  setTemplateEngine(){

     app.engine('handlebars' , exhandlebars({helpers : {

      generateTime : generateTime
      ,
      select : select  ,
      check : check ,
      content : content

    }}));
     app.set('view engine','handlebars') ;

  }
  
  setrouteMiddlewares(){

    // router middlewares  : 
    app.use('/',require('./routes/home/index'));
    app.use('/admin',require('./routes/admin/index'));
    app.use('/admin/posts',require('./routes/admin/posts'));    
    app.use('/admin/categories',require('./routes/admin/cat'))
 
  }



}


