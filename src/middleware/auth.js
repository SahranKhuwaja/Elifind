const User = require('../models/user');
const jwt = require('jsonwebtoken');
const Token = require('../models/token');


const auth = async (req,res,next)=>{

    try{
    const token = await req.session.token;
    const decoded = await jwt.verify(token,process.env.JWT_SECRECT2);
    const finalDecoded = await jwt.decode(token);
    const final = await jwt.verify(finalDecoded._id,process.env.JWT_SECRECT1);
    const user = await User.findOne({_id:final._id});
    const t = await Token.find({Owner:user._id,'Token.token':token, 'Token.expiresIn':{ $gt: Date.now() }});

    if(t.length===0){
        return res.redirect('/Login');
    }
    if(!user || t.length===0){
       
        return res.redirect('/Login');
    }

    user.Password = undefined;
    req.user = user;
  

 
    
   
    
    
    
    next();

    }catch(e){
        res.redirect('/Login');
        
    }
   
    



}


module.exports = auth;