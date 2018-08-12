
const mongoose = require('mongoose') ;

const Schema = mongoose.Schema ;

const catSchema = new Schema({


    name :{
        
        type : String , required :true 

    } ,
    

    posts : [{ 

        type : Schema.Types.ObjectId , ref : 'posts'

    }] 

},{usePushEach : true});


module.exports = mongoose.model('categories',catSchema) ;




