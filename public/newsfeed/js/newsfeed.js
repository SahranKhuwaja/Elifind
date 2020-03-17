$(document).ready(()=>{
    $('#filter').hide('fast');
    filter()
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

