const Review = require('../models/review');

const reviewCheck = async(req,res,next)=>{
    try{
        let review = await Review.findOne({ ...req.body.type === 'Project' ? { ProjectID: req.body.id } : { PortfolioID: req.body.id },
         Type:req.body.type, ReviewedBy:req.user._id }, { Review: 1 });
        if (review) {
            return false;
        }
        await next();

    }catch(e){
        console.log(e);
    }
}

module.exports = reviewCheck;