const mongoose = require('mongoose');
const moment = require('moment');
const User = require('./user');
const Company = require('./company');
const Rating = require('./rating');

const reviewSchema = new mongoose.Schema({

    Type: {
        type: String,
        required: true
    },
    ProjectID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Projects'
    },
    PortfolioID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Portfolios'
    },
    ReviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    Review: {
        type: String,
        required: true
    }
});

reviewSchema.statics.review = async (id, ReviewedBy, ReviewValue, Type) => {

    const review = new Review({ ...Type === 'Project' ? { ProjectID: id } : { PortfolioID: id }, Type, ReviewedBy, Review: ReviewValue });
    await review.save();
    return true;

}

reviewSchema.statics.getReviews = async (id, Type, MyID) => {

    try {

        const reviews = await Review.find({ ...Type === 'Project' ? { ProjectID: id } : { PortfolioID: id }, Type }, { Review: 1, ReviewedBy: 1 });
        if (reviews.length !== 0) {

            let alreadyReviewed = false;
            const reviewsArray = await Promise.all(reviews.map(async e => {
                return {
                    ...await Review.reviewedBy(e.ReviewedBy, id, MyID, Type), Review: e.Review,
                    time: await moment(e.createdAt).fromNow()
                }

            }))

            return reviewsArray;
        }
        
        return null;
        

    } catch (e) {
        console.log(e)
    }
}

reviewSchema.statics.reviewedBy = async (id, ReferenceID, MyID, Type) => {

    try {
        const user = await User.findById(id, { FirstName: 1, LastName: 1, Dp: 1, Role: 1 });
        let Dp = undefined;
        if (user.Dp) {
            Dp = await Buffer.from(user.Dp).toString('base64');
            delete user.Dp;
        }
        let userRating = await Rating.myRating(ReferenceID, id, Type);
        if (user.Role === 'Company') {
            const company = await Company.findOne({ Owner: id }, { CompanyName: 1 });
            return { ...company.toObject(), Dp, _id: id, userRating: userRating.Rating, Role: user.Role, reviewed: id.equals(MyID) ? true : false }
        }

        return { ...user.toObject(), Dp, userRating: userRating.Rating, reviewed: id.equals(MyID) ? true : false };
    } catch (e) {
        console.log(e)
    }

}

const Review = mongoose.model('Reviews', reviewSchema);
module.exports = Review;