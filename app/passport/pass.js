
const User = require('./../models/User') ;
const passport = require('passport') ;
const LocalStrategy = require('passport-local').Strategy ;

module.exports = {


  setStrategy : (email,password,done)=>{


    User.findOne({email : email}).then(fuser=>{
        
    if (!fuser) { 
       
        return done(null, false,{ message :"no User Founded" });
     }  
    
    if(!User.schema.methods.checkPass(password,fuser.password)){
       
       
         return done(null,false,{message:"Incorrect Password"}) ;
    }
  
    return done(null, fuser ,{message:'u are Logged In Now'});
       
    }).catch(err=>{
        console.log('Error in Finding User'  + err) ;

        return done(null, false,{ message :"no User Founded" });

    }) ; 
  


}



  ,setConfig:()=>{

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
       
      passport.deserializeUser(function(id, done) {
        User.findById(id, function (err, user) {
          done(err, user);
        });
      });
    


    }











  }







