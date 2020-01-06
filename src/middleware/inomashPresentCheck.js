const InoMash = require('../models/inomash');

const inomashPresentCheck = async(req,res,next)=>{


  
const data = await InoMash.findOne({Owner:req.user._id});


if(!data){
 return  next();
}

res.redirect('/Profile/Inomash');
}


module.exports = inomashPresentCheck;