
$(document).ready(()=>{
    getAllNotifications();
    getRecommendations();
})

const getAllNotifications = ()=>{

    $.get('/Profile/Notifications',undefined,(data,status,xhr)=>{
        if(status ==='success'){
            renderAllNotifications(data);
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


const getUserInfo = async (data) => {

    $.get('/Profile/Recommendations/User/Data/Fetch', data, (data, status, xhr) => {
        if (status === 'success') {
            renderNeighbours(data.neighbours);
            renderPredictions(data.predictions);
        }


    })
}


const renderAllNotifications = async(data)=>{

    const template = document.querySelector('#n-item').innerHTML;
    const parent = document.querySelector('#contentDiv');
    const html = Handlebars.compile(template);
    parent.insertAdjacentHTML('beforeend',html({Notifications:data})) 


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