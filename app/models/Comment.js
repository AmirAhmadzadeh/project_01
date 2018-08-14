
const mongoose = require('mongoose') ;

const Schema = mongoose.Schema ;

const commentSchema = new Schema({


  
     user : {

        type : Schema.Types.ObjectId  , ref : 'users',required:true
     },


     comment:{

        type : String, required:true 
     }
    , 
     date : {

        type:Date , default:Date.now() 
      }
    , post :{


        type :Schema.Types.ObjectId ,ref:'posts'
    }
     , status :{

        type : Boolean , default : true

      } 


});


module.exports = mongoose.model('comments',commentSchema) ;




