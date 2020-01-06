 $(document).ready(()=>{

   $('#video').hide('fast');
   $('#calling').hide('fast');
    if(!$('#dp').length){ 
      
       const url = window.location.pathname;  
       const id = url.split('/')[3];

       if($('#hireOpt').length){
        
        checkHire(id);

       }
       hiredBy(id,user=false)
      
    }
    else{
        
       const id = document.querySelector('#clogged').innerHTML.trim(); 
       if(id.length!==0){
       hiredBy(id,user=true);  
       }     

    }
    

});

const hire = (id)=>{

  
    $.post('/Profile/Hire',{id},(data,status,xhr)=>{
      
     if(data===true && status === 'success'){
         checkHire(id);
         hiredBy(id,user=false);
     }
        
    })

}

const checkHire = (id)=>{
    
    $.get('/Profile/Hire',{id},(data,status,xhr)=>{

        if(data===true && status === 'success'){
            
            hiredByMe();
               

        }
        else if(data===false && status ==='success'){

            notHired(id);
 
        }
        else{
           
            alreadyHired();

        }
    })
}

const notHired = (id)=>{

    const place = document.querySelector('#hireOpt');
    const btnTemplate = document.querySelector('#notHired').innerHTML;
    if($('#hiredA').length){
        $('#hiredA').remove();
    }
    const html = Mustache.render(btnTemplate,{Title:'HIRE ME',Title2:'INTERVIEW'});
    place.insertAdjacentHTML('beforeend',html);
    document.querySelector('#btnConduct').addEventListener('click',(e)=>{
        e.preventDefault();
        conduct(id);

    })

}

const alreadyHired = ()=>{
    const place = document.querySelector('#hireOpt');
    const btnTemplate = document.querySelector('#hiredAlready').innerHTML;
    $('#btnHire').remove();
    $('#btnConduct').remove();
    const html = Mustache.render(btnTemplate,{Title:'ALREADY HIRED'});
    place.insertAdjacentHTML('beforeend',html);
    document.getElementById('hiredA').style.pointerEvents = 'none';
    $('#hireModal').remove();
    $('#unhireModal').remove();

}

const hiredByMe = ()=>{

    const place = document.querySelector('#hireOpt');
    const btnTemplate = document.querySelector('#hiredAlready').innerHTML;
    $('#btnHire').remove();
    $('#btnConduct').remove();
    const html = Mustache.render(btnTemplate,{Title:'HIRED'});
    place.insertAdjacentHTML('beforeend',html);
    document.querySelector('#hiredA').setAttribute('data-toggle','modal');
    document.querySelector('#hiredA').setAttribute('data-target','#unhireModal');
    

}

const unHire = (id)=>{
    $.post('/Profile/Unhire',{id},(data,status,xhr)=>{

        if(data=== true && status === 'success'){
            checkHire(id);
            hiredBy(id,user=false);
        }


    });
}

const hiredBy = (id,user)=>{

    $.get('/Profile/HiredBy',{id},(data,status,xhr)=>{

        if(data.data === true && status === "success" ){
            if(user){
                const place = document.querySelector('#hiredByBar');
                const template = document.querySelector('#hiredS').innerHTML;
                const html = Mustache.render(template,{id:data.company.Owner,Company:data.company.CompanyName,msg:"Hired By:"});
                place.insertAdjacentHTML('beforeend',html);
                document.querySelector('#leave').setAttribute('data-toggle','modal');
                document.querySelector('#leave').setAttribute('data-target','#leaveModal');
            }
            else{
                const place = document.querySelector('#pI');
                const template = document.querySelector('#showHiredBy').innerHTML;
                const html = Mustache.render(template,{id:data.company.Owner,Company:data.company.CompanyName});
                place.insertAdjacentHTML('beforeend',html);
               
            }
        }else{
            if($('#hc').length){

                $('#hc').remove();
            }
            
        }

    })
    

}

const leave = (id)=>{
    
    $.post("/Profile/Leave",{id},(data,status,xhr)=>{

        hiredBy(id,user=true);


    });
}



const conduct = (to)=>{

    
    socket.emit('checkOnline',to);
    let count = 0;
   
   
    socket.on('status',(data)=>{
    
      if(data.online){
        count++;
        if(count===1){
        $.noConflict(true); 
        $('#calling').modal('show');
        
       // document.querySelector('#btnCan').setAttribute('data-dismiss','modal');
       $('#btnCan').attr('data-dismiss','modal');
       document.querySelector('#btnCan').addEventListener('click',(e)=>{

        socket.emit('end',data.to);
        

       })
        socket.emit('callingToClient',data.to);
        }
       }else{
           document.querySelector('#btnConduct').setAttribute('data-target','#notOnline');
           
          
       }

    });
    //setTimeout(2000)
  //$.noConflict(false);


}

socket.on('showCalling',(data)=>{
   
  var btn = document.createElement('button');
  btn.id="r";
  document.querySelector('#temp').append(btn);
  document.querySelector('#r').setAttribute('data-toggle','modal');
  document.querySelector('#r').setAttribute('data-target','#receiving');
  $('#r').trigger('click');
  $('#btnR').click(function(){
      attend(data);
  })
  document.querySelector('#btnC').addEventListener('click',()=>{

    socket.emit('end',data.from);

  })
 
})

const attend = (data)=>{
    socket.emit('connectCall',data);
}

socket.on('buildConnection',(data)=>{
    call(data);
})

socket.on('cancelCall',()=>{
    location.reload();
})

const call = (data)=>{
    $('#btnCan').attr('data-dismiss','modal');
    $('#btnCan').trigger('click');
    $('.container').hide('slow');
    document.querySelector('#end').addEventListener('click',(e)=>{
        e.preventDefault();
        socket.emit('endCall',data);
    })

    const video = document.querySelector('video')
    const filter = document.querySelector('#filter')
    const checkboxTheme = document.querySelector('#theme')
    let client = {}
    let currentFilter
    $('#video').show('slow');
    //get stream
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            socket.emit('call')
            video.srcObject = stream
            video.play()
    
            filter.addEventListener('change', (event) => {
                currentFilter = event.target.value
                video.style.filter = currentFilter
                SendFilter(currentFilter)
               
            })
    
            //used to initialize a peer
            function InitPeer(type) {
                let peer = new SimplePeer({ initiator: (type == 'init') ? true : false, stream: stream, trickle: false })
                peer.on('stream', function (stream) {
                    CreateVideo(stream)
                })
                
                peer.on('data', function (data) {
                    let decodedData = new TextDecoder('utf-8').decode(data)
                    let peervideo = document.querySelector('#peerVideo')
                    peervideo.style.filter = decodedData
                })
                return peer
            }
    
            //for peer of type init
            function MakePeer() {
                client.gotAnswer = false
                let peer = InitPeer('init')
                peer.on('signal', function (data) {
                    if (!client.gotAnswer) {
                        socket.emit('Offer', data)
                    }
                })
                client.peer = peer
            }
    
            //for peer of type not init
            function FrontAnswer(offer) {
                let peer = InitPeer('notInit')
                peer.on('signal', (data) => {
                    socket.emit('Answer', data)
                })
                peer.signal(offer)
                client.peer = peer
            }
    
            function SignalAnswer(answer) {
                client.gotAnswer = true
                let peer = client.peer
                peer.signal(answer)
            }
    
            function CreateVideo(stream) {
                CreateDiv()
    
                let video = document.createElement('video')
                video.id = 'peerVideo'
                video.srcObject = stream
                video.setAttribute('class', 'embed-responsive-item')
                document.querySelector('#peerDiv').appendChild(video)
                video.play()
                //wait for 1 sec
                setTimeout(() => SendFilter(currentFilter), 1000)
    
                video.addEventListener('click', () => {
                    if (video.volume != 0)
                        video.volume = 0
                    else
                        video.volume = 1
                })
    
            }
    
            function SessionActive() {
                document.write('Session Active. Please come back later')
            }
    
            function SendFilter(filter) {
                if (client.peer) {
                    client.peer.send(filter)
                }
            }
    
            function RemovePeer() {
                document.getElementById("peerVideo").remove();
                document.getElementById("muteText").remove();
                if (client.peer) {
                    client.peer.destroy()
                }
            }
    
            socket.on('BackOffer', FrontAnswer)
            socket.on('BackAnswer', SignalAnswer)
            socket.on('SessionActive', SessionActive)
            socket.on('CreatePeer', MakePeer)
            socket.on('Disconnect', RemovePeer)
    
        })
        .catch(err => document.write(err))
    
    checkboxTheme.addEventListener('click', () => {
        if (checkboxTheme.checked == true) {
            document.body.style.backgroundColor = '#212529'
            if (document.querySelector('#muteText')) {
                document.querySelector('#muteText').style.color = "#fff"
            }
    
        }
        else {
            document.body.style.backgroundColor = '#fff'
            if (document.querySelector('#muteText')) {
                document.querySelector('#muteText').style.color = "#212529"
            }
        }
    }
    )
    
    function CreateDiv() {
        let div = document.createElement('div')
        div.setAttribute('class', "centered")
        div.id = "muteText"
        div.innerHTML = "Click to Mute/Unmute"
        document.querySelector('#peerDiv').appendChild(div)
        if (checkboxTheme.checked == true)
            document.querySelector('#muteText').style.color = "#fff"
    }



}


  



