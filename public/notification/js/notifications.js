
$(document).ready(()=>{
    getAllNotifications();
})

const getAllNotifications = ()=>{

    $.get('/Profile/Notifications',undefined,(data,status,xhr)=>{
        if(status ==='success'){
            renderAllNotifications(data);
        }
    })
}


const renderAllNotifications = async(data)=>{

    const template = document.querySelector('#n-item').innerHTML;
    const parent = document.querySelector('#contentDiv');
    const html = Handlebars.compile(template);
    parent.insertAdjacentHTML('beforeend',html({Notifications:data})) 


}