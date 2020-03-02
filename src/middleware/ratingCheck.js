const Rating = require('../models/rating');

const ratingCheck = async(req,res,next)=>{
    try{
        let check;
        if(!req.body.userID){
            check = await Rating.findOne({Owner:req.user._id,'Ratings.ReferenceID':req.body.id},{'Ratings.$':1});
        }
        else{
            check = await Rating.findOne({Owner:req.body.userID,'Ratings.ReferenceID':req.body.id},{'Ratings.$':1});
        }
        if(check){
     
          check = await check.Ratings[0].Rating.filter(e=>e.RatedBy.equals(req.user._id));
           if(check.length !==0){
               return res.sendStatus(500);
           }
        }

        await next();

    }catch(e){
        console.log(e);
    }
}

module.exports = ratingCheck;