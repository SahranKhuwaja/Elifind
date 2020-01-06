


document.getElementById('ino').style.pointerEvents = 'none';
$(document).ready(function(){

 $('#ino').addClass('active');
 $('#about').removeClass('active');


});



$("#downloadIcon").click(function(){
    window.location.href='http://localhost:3000/Profile/Inomash/View?Download';
  
});