const mongoose = require('mongoose') ;
const bcrypt  = require('bcryptjs')  ;

const Schema = mongoose.Schema ;


const userSchema = new Schema({


   firstName: {

    type : String , required : true 
   },

   lastName: {
    
        type : String , required : true 
       },
       
    email: {
        
            type : String , required : true 
           },
        
    password : {

        type : String , required : true  
     }      
    , date :{

      type : Date , default:Date.now() 
    },
    status :{

      type : String , default : "user" 
    },
    comments : [{

      type :Schema.Types.ObjectId , ref : 'comments'
    }] 

}, { usePushEach :true } );



userSchema.methods = {

      checkPass : (password,hash)=>{
            
           return  bcrypt.compareSync(password,hash) ;
           
      }
}


module.exports = mongoose.model('users',userSchema)  ;
