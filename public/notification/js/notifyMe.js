
socket.on('notify',(data)=>{
 
    notify('custom',data.FirstName?data.FirstName + ' ' + data.LastName:data.CompanyName,data.Notification,data.NotificationAbout,
    data.MediaName !==undefined?data.MediaName:"", moment(data.createdAt).fromNow(),data.Dp,
    `/Profile/View/${data.NotifiedBy}/Timeline`, data.NotificationAbout === 'project'?'/Profile/Projects':
    data.NotificationAbout === 'portfolio'?'/Profile/Portfolios':`/Profile/View/${data.Owner}/Timeline`
    );
})

socket.on('notifyWelcome',(data)=>{
    notify('custom', data.CompanyName,"",data.Notification + " " + data.NotificationAbout,
     data.CompanyName ,moment(data.createdAt).fromNow(),data.Dp,
    `/Profile/View/${data.NotifiedBy}/Timeline`,  `/Profile/View/${data.NotifiedBy}/Timeline`
    );
})