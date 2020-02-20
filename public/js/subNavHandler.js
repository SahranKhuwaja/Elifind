
    const urlParameter = window.location.pathname;  
    const user_id = urlParameter.split('/')[3];
    if(location.pathname==='/Profile/Timeline' || location.pathname ===`/Profile/View/${user_id}/Timeline`){
      $(document).ready(function(){ 
        document.getElementById('tl').style.pointerEvents = 'none';
           $('#tl').addClass('active');
           $('#about').removeClass('active');

      })   
    }
    else if(location.pathname==='/Profile/Inomash' || location.pathname ===`/Profile/View/${user_id}/Inomash`){
        $(document).ready(function(){
          document.getElementById('ino').style.pointerEvents = 'none';
          $('#ino').addClass('active');
          $('#about').removeClass('active');

       });
    }
    else if(location.pathname==='/Profile/Projects' || location.pathname ===`/Profile/View/${user_id}/Projects`){
        $(document).ready(function(){
            document.getElementById('pro').style.pointerEvents = 'none';
            $('#pro').addClass('active');
            $('#about').removeClass('active');
  
         });
    }
    else if(location.pathname==='/Profile/Portfolios' || location.pathname ===`/Profile/View/${user_id}/Portfolios`){
        $(document).ready(function(){
            document.getElementById('port').style.pointerEvents = 'none';
            $('#port').addClass('active');
            $('#about').removeClass('active');
  
         });
    }
    else{
        
    }
    




    $("#downloadIcon").click(function(){
        window.location.href='http://localhost:3000/Profile/Inomash/View?Download';
      
    });
