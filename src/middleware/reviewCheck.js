const Review = require('../models/review');

const reviewCheck = async(req,res,next)=>{
    try{
        let check;
        if(!req.body.userID){
            check = await Review.findOne({Owner:req.user._id,'Reviews.ReferenceID':req.body.id},{'Reviews.$':1});
        }
        else{
            check = await Review.findOne({Owner:req.body.userID,'Reviews.ReferenceID':req.body.id},{'Reviews.$':1});
        }
        if(check){
     
          check = await check.Reviews[0].Review.filter(e=>e.ReviewedBy.equals(req.user._id));
           if(check.length !==0){
               return res.sendStatus(500);
           }
        }

        await next();

    }catch(e){
        console.log(e);
    }
}

module.exports = reviewCheck;