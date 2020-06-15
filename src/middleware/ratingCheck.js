const Rating = require('../models/rating');

const ratingCheck = async (req, res, next) => {
    try {
        let rate = await Rating.findOne({ ...req.body.type === 'Project' ? { ProjectID: req.query.id } : 
        { PortfolioID: req.query.id }, Type:req.body.type, RatedBy:req.user._id }, { Rating: 1 });
        if (rate) {
            return false;
        }
        await next();

    } catch (e) {
        console.log(e);
    }
}

module.exports = ratingCheck;