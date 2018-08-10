
const mongoose = require('mongoose') ;

const Schema = mongoose.Schema ;

const catSchema = new Schema({


    name :{
        type : String , required :true 
    }

});



module.exports = mongoose.model('categories',catSchema) ;




