


$(document).ready(function(){


    check();
})




function check(callback){

    let url;
    var source, template;
   
    if(document.querySelector('#filter').checked===true){
       
        url = '/Profile/Search/Data'+location.search+'&filter=true';
    }else{
       
        url = '/Profile/Search/Data'+location.search+'&filter=false';
    }
   

    $.ajax({

        url:url,
        type:"GET",
        
        
    }).done(function(data){
    
        perform(data);
    });
    
}


function perform(data){

   

    var theTemplateScript = document.querySelector("#entry-template").innerHTML;
    var theTemplateScript2 = document.querySelector("#result-info-template").innerHTML;

  
   var info = Handlebars.compile(theTemplateScript);
   var info2 = Handlebars.compile(theTemplateScript2);

   var dataHtml;
   var dataHtml2;

   if(data.length===0){
     dataHtml = info({
        noResult:true
   });

  }else{

     dataHtml = info({
        res:data
        
   });
  }
   const urlGetKeyWord = new URLSearchParams(location.search);
  dataHtml2 = info2({
      count:data.length,
      keyword:urlGetKeyWord.get("search")
  })
   
  document.querySelector('#contentDiv').innerHTML = dataHtml;
  document.querySelector('#result-info-head').innerHTML = dataHtml2;


}
