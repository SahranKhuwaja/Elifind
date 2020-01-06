

if(document.getElementById("error-message").innerHTML.length!==0){
   
    document.getElementById("emsg").hidden = false;
       
}



if(document.getElementById("s-message").innerHTML.length!==0){
   
    document.getElementById("smsg").hidden = false;
       
}



function Validate() {
        
    var error = document.getElementById('error-message');
    var password = document.getElementById('Password').value;
    var confirmPassword = document.getElementById('cPassword').value;
    var decimal=  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
   
    if (password != confirmPassword) {
       
        document.getElementById('emsg').hidden = false;
        error.textContent = '* Password doesnt match!';
        return false;
    }
    if(!password.match(decimal)) 
    { 
        if(password.length==0){
           return true;
        }
        document.getElementById('emsg').hidden = false;
        error.textContent = '* Password should be between 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character!';    
        return false; 
              
    }
    
    return true;
}







document.getElementById("main").href="/#page-top";
document.getElementById("one").href="/#about-us";
document.getElementById("two").href="/#service";
document.getElementById("three").href="/#team";