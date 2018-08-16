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
   
   
         },
         deleteBtn:(options)=>{
  
             if(options.hash.statusUser != 'admin') {return ` <td>
                <form action="/admin/users/delete/${options.hash.user._id}?_method=DELETE " method="post">
            
                  <input type="submit" value="DELETE">
             
               </form>
               </td>` ;
            
            }
             
             return null ;





         }
         ,paginate:(options)=>{


     /*  
          <li><a href="#">&lt;</a></li>
          
           <li class="active"><a href="?page=1">1</a></li>+
           
          <li><a href="#">&gt;</a></li>     
           
      */

         console.log(options.hash.current , options.hash.pages) ;

      
         let pages =  Number(options.hash.pages) ;
         let currentPage = Number(options.hash.current) ;
        
         let output = '' ;
         if(currentPage === 1){
 
             output += `<li class="page-item disabled"><a class="page-link" href="/?page=1">&lt</a> </li>'` ;
         
         }else { 
 
             output += `<li class="page-item" active><a class="page-link" href="/?page=1">&lt</a> </li>` ;
             
         }
 
         
                     
 
         let i = ((currentPage > 5) ? (currentPage - 4) : 1) ;
 
       //  console.log(i) ;
         if(i !== 1){
 
             output += `<li class="page-item disabled"><a class="page-link" href="#">...</a> </li>` ;
             
         }
 
        
          for(; (i <= currentPage + 4) && (i <= pages) ; i++){
 
            if(i === currentPage){
           
             output += `<li class="page-item disabled" ><a class="page-link" href="/?page=${i}">${i}</a> </li>` ;
           
            }else{
 
             output += `<li class="page-item "><a class="page-link" href="/?page=${i}">${i}</a> </li>` ;
             
            }
         
            
            if(i === currentPage + 4  &&  i < pages){
 
             output += `<li class="page-item disabled"><a class="page-link" href="#">...</a> </li>` 
            }
 
         }    
     
         if(currentPage === pages){
             
               output += `<li class="page-item disabled"><a class="page-link" href="/?page=${pages}">&gt;</a> </li>` ;
   
          }else{
 
             output += `<li class="page-item"><a class="page-link" href="/?page=${pages}">&gt;</a> </li>` ;
             
          }
     
     
         return output  ; 
     

         }


}