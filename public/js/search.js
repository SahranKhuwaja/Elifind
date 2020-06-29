


$(document).ready(function(){


    check();
    getRecommendations();
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

const getRecommendations = async () => {

    $.get('/Profile/Recommendations/Get?k=3', undefined, (data, status, xhr) => {
        if (status === 'success') {
            getViews();
            if (data.Neighbours.length !== 0) {
                getUserInfo(data)
            } 
        }
    })
}


const getUserInfo = async (data) => {

    $.get('/Profile/Recommendations/User/Data/Fetch', data, (data, status, xhr) => {
        if (status === 'success') {
            renderNeighbours(data.neighbours);
            renderPredictions(data.predictions);
        }


    })
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

const getViews = async()=>{

    $.get('/Profile/Recommendations/Get/Views',undefined,(data,status,xhr)=>{
            if(status==='success'){
               if(data.length!==0){
                   getDataOfHighlyViewedProfiles(data)
               }
            }        
    })

}

const getDataOfHighlyViewedProfiles = async(profileData)=>{
 
    $.get('/Profile/Recommendations/HighViewed/Data/Fetch',{profileData},(data,status,xhr)=>{
        if(status==='success'){
            renderHighViewedProfiles(data)
        }
    })

}

const renderNeighbours = async(data)=>{

    const parent = document.querySelector('#sticky-sidebar');
    const template = document.querySelector('#side-bar-template').innerHTML;
    const html = Mustache.render(template,{Title:'Nearest Neighbours',data, recommend:true});
    parent.insertAdjacentHTML('beforeend',html);
}

const renderPredictions = async(data)=>{

    const parent = document.querySelector('#sticky-sidebar');
    const template = document.querySelector('#side-bar-template').innerHTML;
    const html = Mustache.render(template,{Title:'Predictions',data,recommend:true,predict:true});
    parent.insertAdjacentHTML('beforeend',html);
}

const renderHighViewedProfiles = async(data)=>{

    const parent = document.querySelector('#sticky-sidebar');
    const template = document.querySelector('#side-bar-template').innerHTML;
    const html = Mustache.render(template,{Title:'Most Viewed Profiles',data});
    parent.insertAdjacentHTML('beforeend',html);
}
