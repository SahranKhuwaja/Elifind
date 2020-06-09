$(document).ready(()=>{
    if(user_id !==undefined){
      $.post('/Profile/View/Visit',{Owner:user_id})
    }
})