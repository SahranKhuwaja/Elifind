const InoMash = require('../models/inomash');

const inomashPresentCheck2 = async(req,res,next)=>{


if(req.user.Role==='Company'){
    return res.redirect('/Profile/Timeline');
}    
const data = await InoMash.findOne({Owner:req.user._id});


if(data){
 return  next();
}

res.redirect('/Profile/Inomash');
}


module.exports = inomashPresentCheck2;