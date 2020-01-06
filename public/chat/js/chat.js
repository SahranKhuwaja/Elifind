

const socket = io();
const id = document.querySelector('#clogged').innerHTML.trim();

socket.emit('currentUser', id)



socket.on('openChat',(data)=>{

    if(data.to ===id){
        
        if(!document.querySelector('#qnimate')){

             chat(data.from);
        }



    }
});

const chat = (to)=>{
      
const popupMsg = document.querySelector('#qnimate'); 

if(!popupMsg){


socket.emit('getUserInfo',to);

socket.on('userInfo',(UserData)=>{
   
   // if(!document.querySelector('#qnimate')){

const msgBoxDiv = document.querySelector('#messageBoxDiv');
const msgBoxTemplate = document.querySelector('#msg-template').innerHTML;

const html = Mustache.render(msgBoxTemplate,{data:UserData});
msgBoxDiv.insertAdjacentHTML('beforeend',html);

document.querySelector('#closeChatBox').addEventListener('click',(e)=>{
    return close(e.currentTarget);
});

document.querySelector('#att').addEventListener('click',(e)=>{
    e.preventDefault();
    attach(to);
})
document.querySelector('#msgForm').addEventListener('submit',(e)=>{
    e.preventDefault();
    
    if(e.target.elements.msgText.value != ""){
socket.emit('message',{message:e.target.elements.msgText.value,to});
    }
     
    e.target.elements.msgText.value = "";

})
   



const displayMessage = document.querySelector('#displayMessage');
const msgTemplate = document.querySelector('#msg').innerHTML;



socket.emit('getAllMessages', to );

socket.on('displayAllMessages',async(data)=>{
        
        
        const html2 =await Mustache.render(msgTemplate,{data:data.Messages,user1:data.user1,user2:data.user2});
        await displayMessage.insertAdjacentHTML('beforeend',html2);
        await autoScroll();
        
      

});

socket.on('displayMessage',async(data)=>{
   
   
    if((data.from === id && data.to === to) || (data.from === to && data.to === id)){    
    const html3 =await Mustache.render(msgTemplate,{data});
    await displayMessage.insertAdjacentHTML('beforeend',html3);
    await autoScroll();
    
    await socket.emit('open',await data.to,data.from);

    } 
    
    
});

socket.on('warning',async(data)=>{

    if((data.from === id && data.to === to) || (data.from === to && data.to === id)){ 
       
        
        const html3 =await Mustache.render(msgTemplate,{error:data.message});
        await displayMessage.insertAdjacentHTML('beforeend',html3);
        await autoScroll();
        
       
       
    
        } 


});



}); 


} }

const close = (t)=>{

    t.parentNode.parentNode.parentNode.remove();
    socket.removeAllListeners("userInfo");
}

const autoScroll = ()=>{
       
    
    const newMessage =  popupMsg.lastElementChild.lastElementChild.lastElementChild.lastElementChild.lastElementChild;
    popupMsg.scrollTop = popupMsg.scrollHeight;
     
        
}

const attach = (to)=>{
    
    var form = document.createElement('form');
    form.id = 'attach';
    form.enctype = 'multipart/form-data';
    form.style.visibility = false;
    var file = document.createElement('input');
    file.type = 'file';
    file.id = 'attachment';
    file.name = 'attachment';
    form.appendChild(file);

    document.querySelector('#messageBoxDiv').append(form);

 
    $(file).trigger('click');

    $('#attach').submit(function(e){
      
        e.preventDefault();
        socket.emit('attachment',{file:e.target.elements.attachment.files[0],name:e.target.elements.attachment.value,to});
        e.target.remove();
        
        
    });
    $('#attachment').on('change',function(){

    
        $('#attach').submit();

    })
    
    

} 
  



