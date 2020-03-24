$(document).ready(()=>{
    Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    });
    getNotifications();

})


socket.on('notify',async(data)=>{
   
    if(data.Welcome){
        return  notify('custom', data.CompanyName,"",data.Notification + " " + data.NotificationAbout,
        data.CompanyName ,data.time,data.Dp,
       `/Profile/View/${data.NotifiedBy}/Timeline`,  `/Profile/View/${data.NotifiedBy}/Timeline`
       );
    }
    notify('custom',data.FirstName?data.FirstName + ' ' + data.LastName:data.CompanyName,data.Notification,data.NotificationAbout,
    data.MediaName !==undefined?data.MediaName:"", data.time,data.Dp,
    `/Profile/View/${data.NotifiedBy}/Timeline`, data.NotificationAbout === 'project'?'/Profile/Projects':
    data.NotificationAbout === 'portfolio'?'/Profile/Portfolios':`/Profile/View/${data.Owner}/Timeline`
    );
    getNotifications();
    if($('#notify').hasClass('active')){
       $('#notify-tray').toggleClass('active');
        setTimeout(()=>{
           // alert('yeeee')
            $('#notify-tray').toggleClass('active');
            render = true; 
        },200)
     
      
    }
})

const getNotifications = ()=>{

    $.get('/Profile/Notifications?limit=30',undefined,(data,status,xhr)=>{
        if(status === 'success'){
            getUnreadNotifications(data)
        }
    })
}

const getUnreadNotifications = (notifications)=>{

    $.get('/Profile/Notifications/Unread',undefined,(data,status,xhr)=>{
        if(status === 'success'){
            renderNotifications(notifications,data.unread)
        }
    })

}

const renderNotifications = async(data,unread)=>{
    const template  = document.querySelector('#notify-list-item').innerHTML;
    const template2 = document.querySelector('#badge-template').innerHTML;
    const parent = document.querySelector('#notify-holder');
    const parent2 = document.querySelector('#notify-open');
    const html = await Handlebars.compile(template);
    const html2 = await Handlebars.compile(template2);
    parent.innerHTML = await html({Notifications:data});
    if(unread !==0){
       if($('#badgeValue').length!==0){
         return $('#badgeValue').html(html2({value:unread}));
       }
       parent2.insertAdjacentHTML('beforeend',html2({value:unread}));
       
    }
}