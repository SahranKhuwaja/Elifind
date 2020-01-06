
    function Validate() {
        
        var error = document.getElementById('error-message');
        var password = document.getElementById('Password').value;
        var confirmPassword = document.getElementById('cPassword').value;
        var decimal=  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
        //var msgDiv = document.getElementById('msgDiv');
        var msgDivS = document.getElementById('msgDivS').hidden = false;
       
        if (password != confirmPassword) {
            error.hidden = false;
            
            error.innerHTML = '* Password doesnt match!';
           
          //  msgDiv.hidden = false;
            return false;
        }
        if(!password.match(decimal)) 
        { 
            if(password.length==0){
               return true;
            }
            error.hidden = false;
          
            error.innerHTML = '* Password should be between 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character!';
            
            //msgDiv.hidden = false;
            return false; 
                  
        }
        

        error.hidden = true;
        msgDivS.hidden = true;
        msgDiv.hidden = true;
        return true;
    }

    document.getElementById("main").href="/#page-top";
    document.getElementById("one").href="/#about-us";
    document.getElementById("two").href="/#service";
    document.getElementById("three").href="/#team";





   
 
      
   
   


    

    
    
    
    

    






