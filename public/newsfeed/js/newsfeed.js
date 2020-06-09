$(document).ready(()=>{
    $('#filter').hide('fast');
    filter();
    getRecommendations();
})

$('#filter-toggle').click(()=>{
    $('#filter-toggle').hide('fast');
    $('#filter').show('fast');
   
})

$('#done').click(()=>{
    $('#filter').hide('fast');
    $('#filter-toggle').show('fast');
   
});

const filter = ()=>{

  let url;
  if($('#locationFilter').prop('checked') && $('#skillFilter').prop('checked')){
     url = "/Profile/Newsfeed/Posts?location=true&&skill=true"
  }
  else if($('#locationFilter').prop('checked')){
    url = "/Profile/Newsfeed/Posts?location=true&&skill=false"
  }
  else if($('#skillFilter').prop('checked')){
    url = "/Profile/Newsfeed/Posts?location=false&&skill=true"
  }
  else{
    url = "/Profile/Newsfeed/Posts?location=false&&skill=false"
  }
  
  $.get(url,undefined,(data,status,xhr)=>{
      if(status==='success'){
         renderPosts(data);

      }
  })


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

const renderPosts = async(data)=>{
    console.log(data);
    let template = document.querySelector('#newPost').innerHTML;
    let parent = document.querySelector('#contentDiv');
    let html = await Handlebars.compile(template);
    let info = await html({data});
    parent.innerHTML = await info;
    
      await $(document).ready(()=>{
        $('.carousel').carousel()
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
  await parent.insertAdjacentHTML('beforeend',html);
}


