$(document).ready(() => {
  $('#filter').hide('fast');
  filter();
  getRecommendations();
  window._$ = jQuery;
})
let append = true;

$('#filter-toggle').click(() => {
  $('#filter-toggle').hide('fast');
  $('#filter').show('fast');

})

$('#done').click(() => {
  $('#filter').hide('fast');
  $('#filter-toggle').show('fast');

});
let url;
let locationFilter = false;
let skillFilter = false;
const filter = () => {


  if ($('#locationFilter').prop('checked') && $('#skillFilter').prop('checked')) {
    url = "/Profile/Newsfeed/Posts?location=true&&skill=true";
    locationFilter = true,
      skillFilter = true;
  }
  else if ($('#locationFilter').prop('checked')) {
    url = "/Profile/Newsfeed/Posts?location=true&&skill=false";
    locationFilter = true,
      skillFilter = false;
  }
  else if ($('#skillFilter').prop('checked')) {
    url = "/Profile/Newsfeed/Posts?location=false&&skill=true";
    locationFilter = false,
      skillFilter = true;
  }
  else {
    url = "/Profile/Newsfeed/Posts?location=false&&skill=false";
    locationFilter = false,
      skillFilter = false;
  }

  $.get(url, undefined, (data, status, xhr) => {
    if (status === 'success') {
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


const renderPosts = async (data, single) => {

  let template = document.querySelector('#newPost').innerHTML;
  let parent = document.querySelector('#contentDiv');
  let html = await Handlebars.compile(template);
  let info = await html({ data });
  let obj = undefined;
  if (single) {
    if (locationFilter && skillFilter) {
      obj = { Country: data[0].Country, Skill: data[0].About }
    } else if (locationFilter) {
      obj = { Country: data[0].Country }
    }
    else if (skillFilter) {
   
      obj = { Skill: data[0].About }

    }
    else {
      obj = undefined;
    }

    if (obj === undefined) {
      parent.insertAdjacentHTML('afterbegin', info)
    }else{
      $.get('/Profile/Newsfeed/Match',obj,(data,status,xhr)=>{
          if(status==='success' && data ===true){
            parent.insertAdjacentHTML('afterbegin', info)
          }
      })
    }

  } else {
    parent.innerHTML = await info;
    await $(document).ready(() => {
      $('.carousel').carousel()
    })
    if (append) {
      await appendScripts();
      append = await false;
    }
  }

}


const getUserInfo = async (data) => {

  $.get('/Profile/Recommendations/User/Data/Fetch', data, (data, status, xhr) => {
    if (status === 'success') {
      renderNeighbours(data.neighbours);
      renderPredictions(data.predictions);
    }


  })
}

const getViews = async () => {

  $.get('/Profile/Recommendations/Get/Views', undefined, (data, status, xhr) => {
    if (status === 'success') {
      if (data.length !== 0) {
        getDataOfHighlyViewedProfiles(data)
      }
    }
  })

}

const getDataOfHighlyViewedProfiles = async (profileData) => {

  $.get('/Profile/Recommendations/HighViewed/Data/Fetch', { profileData }, (data, status, xhr) => {
    if (status === 'success') {
      renderHighViewedProfiles(data)
    }
  })

}

const renderNeighbours = async (data) => {

  const parent = document.querySelector('#sticky-sidebar');
  const template = document.querySelector('#side-bar-template').innerHTML;
  const html = Mustache.render(template, { Title: 'Nearest Neighbours', data, recommend: true });
  parent.insertAdjacentHTML('beforeend', html);
}

const renderPredictions = async (data) => {

  const parent = document.querySelector('#sticky-sidebar');
  const template = document.querySelector('#side-bar-template').innerHTML;
  const html = Mustache.render(template, { Title: 'Predictions', data, recommend: true, predict: true });
  parent.insertAdjacentHTML('beforeend', html);
}

const renderHighViewedProfiles = async (data) => {

  const parent = document.querySelector('#sticky-sidebar');
  const template = document.querySelector('#side-bar-template').innerHTML;
  const html = Mustache.render(template, { Title: 'Most Viewed Profiles', data });
  await parent.insertAdjacentHTML('beforeend', html);
}


const appendScripts = () => {
  var newscript = document.createElement('script');
  newscript.id = 'jj';
  newscript.type = 'text/javascript';
  newscript.async = true;
  newscript.src = 'https://code.jquery.com/jquery-1.12.4.js';
  document.getElementsByTagName('body')[0].appendChild(newscript);
  var newscript = document.createElement('script');
  newscript.id = 'bt4';
  newscript.type = 'text/javascript';
  newscript.async = true;
  newscript.src = 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js';
  document.getElementsByTagName('body')[0].appendChild(newscript);
}

socket.on('realTimePostRender', async (posts) => {

  await renderPosts(posts, true);
})




