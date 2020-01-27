const User = require('../models/user');
const role = async(req,res,next)=>{
   
    try{
       const id = req.query.id || req.body.id;
       const user = await User.findById(id,{Role:1});
       console.log(user);
       if(user.Role === "Company"){
         return res.send(false);
       }

    next();

    }catch(e){
        console.log(e);
    }



}

module.exports = role;