
const mongoose = require('mongoose') ;

const Schema =mongoose.Schema ;

const postSchema = new Schema({


    title : {

        type : String , required : true
    } ,
    categories:[{

        type : Schema.Types.ObjectId  , ref:'categories'
    }]

    ,
    content : {

        type : String  , required : true
                      
    }
    ,
    date : {

        type:Date , default: Date.now()
    },

   allowComments:{

        type : Boolean  , required : true 
   },

    status : {
        type : String , required : true
    }
     ,
     
    file:{

        type : String 

     } ,

     comments:[{
        type:Schema.Types.ObjectId , ref:'comments'

     }] ,
     user:{

        type : Schema.Types.ObjectId , ref : 'users'
     }

    
},{usePushEach : true});


module.exports = mongoose.model('posts',postSchema) ;









