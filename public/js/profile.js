
const edit = document.querySelector('#edit');
const btn = document.getElementById("save");
var fname = document.getElementById("fname");
var lname = document.getElementById("lname");
var gen = document.getElementById("Gender");
var city = document.getElementById("city");
var country = document.getElementById("country");
var Phone = document.getElementById("Phone");
var dob = document.getElementById("dob");
var bdy = document.getElementById('Birthday');
var passChange = document.querySelector('#passChange');
var info = document.getElementById("info");
var editPass = document.getElementById("editPass");
var mbox = document.getElementById("error-message");
var success = document.getElementById("success-message");


gen.value = document.getElementById("g").value; 
country.value = document.getElementById("c").value;

edit.addEventListener('click',(e)=>{

    e.preventDefault();
    btn.style.display = "block";
    fname.disabled = false;
    fname.style.pointerEvents = 'auto';
    lname.disabled = false;
    lname.style.pointerEvents = 'auto';
    gen.disabled = false;
    gen.style.pointerEvents = 'auto';
    city.disabled = false;
    city.style.pointerEvents = 'auto';
    country.disabled = false;
    country.style.pointerEvents = 'auto';
    Phone.disabled = false;
    Phone.style.pointerEvents = 'auto';
    dob.style.display = 'none';
    bdy.style.display = 'block';
  
    
})

passChange.addEventListener('click',(e)=>{
     e.preventDefault();
     info.style.display = "none";
     editPass.style.display = "block";
});
document.querySelector('#basicInfo').addEventListener('click',(e)=>{

    e.preventDefault();
    mbox.innerHTML = "";
    success.innerHTML = "";
    mbox.hidden = true;
    success.hidden = true;
    document.getElementById("msgDiv").hidden = true;
    document.getElementById("successDiv").hidden = true;
    info.style.display = "block";
    editPass.style.display = "none";

})


    if(mbox.innerHTML.length!==0){

        $(document).ready(function(){

            $('#passChange').trigger('click'); 
            info.style.display = "none";
            editPass.style.display = "block";
            document.getElementById("msgDiv").hidden= false;
            mbox.hidden = false;



        })    
        
    }

    if(success.innerHTML.length!==0){

        $(document).ready(function(){

            $("#passChange").trigger('click'); 
            info.style.display = "none";
            editPass.style.display = "block";
            document.getElementById("successDiv").hidden = false;
            success.hidden = false;



        })    
        
    }




$('#basicInfo').click(function(){
  
    $('#pc').removeClass('active');
    $('#pass').removeClass('active');
      $('#basic').addClass('active');
    $('#basicI').addClass('active');
    

})


$(document).ready(function(){
    $("#navI").click(function(){
       $("#formLogout").submit();
    });
  });


  function Validate() {
        
    var error = document.getElementById('error-message');
    var password = document.getElementById('Password').value;
    var confirmPassword = document.getElementById('cPassword').value;
    var decimal=  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    var msgDiv = document.getElementById('msgDiv');
   
   
    if (password != confirmPassword) {
        error.hidden = false;
        
        error.innerHTML = '* Password doesnt match!';
       
       msgDiv.hidden = false;
        return false;
    }
    if(!password.match(decimal)) 
    { 
        if(password.length==0){
           return true;
        }
        error.hidden = false;
      
        error.innerHTML = '* Password should be between 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character!';
        
        msgDiv.hidden = false;
        return false; 
              
    }
    

    error.hidden = true;
    msgDiv.hidden = true;
    return true;
}

document.getElementById('about').style.pointerEvents = 'none';

$(document).ready(()=>{

    if($('#info').length){

      if(document.querySelector('#success-add-skill').innerHTML.length !==0){

        $('#basicI').removeClass('active');
        $('#basic').removeClass('active');
        $('#pc').removeClass('active');
        $('#pass').removeClass('active');
        $('#info').hide('slow');
        $('#editPass').hide('slow');
        $('#skillSection').show('slow');
        $('#sDiv').addClass('active');
        $('#sd').addClass('active');
        $('#skillM').show('fast');
        $('#success-add-skill').show('fast');


      }else{
        $('#skillSection').hide('fast');
      }
    }


})

if($('#info').length){

    $('#sK').click((e)=>{
        e.preventDefault();
        $('#basicI').removeClass('active');
        $('#basic').removeClass('active');
        $('#pc').removeClass('active');
        $('#pass').removeClass('active');
        $('#info').hide('slow');
        $('#editPass').hide('slow');
        $('#skillSection').show('slow');
        $('#sDiv').addClass('active');
        $('#sd').addClass('active');

        
    })

    $('#passChange').click((e)=>{
        e.preventDefault();
        $('#skillSection').hide('slow');
        $('#sDiv').removeClass('active');
        $('#sd').removeClass('active');
        $('#basic').removeClass('active');
        $('#basicI').removeClass('active');
        $('#pc').addClass('active');
        $('#pass').addClass('active');

    })

    $('#basicInfo').click((e)=>{
        e.preventDefault();
        $('#sDiv').removeClass('active');
        $('#sd').removeClass('active');
        $('#skillSection').hide('slow');

    })


}

const cat = (e)=>{
  
    if(e.selectedOptions[0].text === 'Other' && e.selectedOptions[0].value === ''){
        
        document.querySelector('#Other').style.pointerEvents = 'auto';
        document.querySelector('#Other').disabled = false;
    }else{

        document.querySelector('#Other').style.pointerEvents = 'none';
        document.querySelector('#Other').disabled = true;

    }
    
}
