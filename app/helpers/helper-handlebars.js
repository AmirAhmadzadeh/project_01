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

        content_summery_side :(options)=>{
          
           if(options.hash.content){
            
            let content = options.hash.content ;
            
             content =  content.substr(0,30);
  
             return  content  ;
          }
         },
         
         content_summery_posts :(options)=>{
          
           if(options.hash.content){
            let content = options.hash.content ;
            
            content =  content.substr(0,60);
        
             return  content  ;
           }
         }
        ,
        content :(options)=>{
             
          if(options.hash.content){
            
          return  options.hash.content  ;
          }
        },
        cm_counter:(options)=>{

           return options.hash.post.comments.length  ;
   
   
         }
     


}