const moment = require('moment') ;

module.exports ={

   generateTime : (date)=>{

       return moment(date).format('MMMM Do YYYY') ;         
    }

    ,

    select : (options)=>{
  
         

         const selected = options.hash.selected ;

         return options.fn(this).replace('value=\"' + selected + '\"','value=\"' + selected + '\"  selected="selected"'); 
   
  
         

        }
        ,
       check : (cats)=>{
    
         console.log(cats) ;
         

        },

        content :(options)=>{

          return options.hash.content ;
        
        }
     


}