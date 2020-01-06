const Company = require('../models/company');

const role = async (req,res,next)=>{
    
   if(req.user.Role === 'Company'){
       
    await req.user.populate('company').execPopulate();
    
     if(!await req.user.company[0]){

        return res.redirect('/Profile/Company');
         
     }else{
        return next();
     }

    }

    
    next();

   
}


module.exports = role;