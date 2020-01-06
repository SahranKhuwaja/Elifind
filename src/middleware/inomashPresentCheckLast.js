const InoMash = require('../models/inomash');

const inomashPresentCheckLast = async(req,res,next)=>{


    try{

const data = await InoMash.findOne({Owner:req.query.id});


if(data){
 return  next();
}

res.redirect(`/Profile/View/${req.query.id}/Inomash`);
}
catch(e){

    

}

}


module.exports = inomashPresentCheckLast;