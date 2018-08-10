const moment = require('moment') ;

module.exports ={

   generateTime : (date)=>{

       return moment(date).format('MMMM Do YYYY') ;         
    }
}