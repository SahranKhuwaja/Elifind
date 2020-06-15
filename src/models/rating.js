const mongoose = require('mongoose');
const lodash = require('lodash');

const ratingSchema = new mongoose.Schema({

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
    RatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    Rating: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

ratingSchema.statics.rate = async (id, RatedBy, RatingValue, Type) => {
    try {
        const rate = new Rating({ ...Type === 'Project' ? { ProjectID: id } : { PortfolioID: id }, Type, RatedBy, Rating: RatingValue });
        await rate.save();
        return true;
    } catch (e) {
        console.log(e)
    }
}

ratingSchema.statics.getRatings = async (id, Type) => {

    try {
        let ratings = await Rating.find({ ...Type === 'Project' ? { ProjectID: id } : { PortfolioID: id }, Type }, { Rating: 1 });
        if (ratings.length !== 0) {
            let average = 0;
            let rating;

            average = await (lodash.sum(await ratings.map(e => parseFloat(e.Rating)))) / ratings.length;
            rating = await lodash.countBy(await ratings.map(e => parseInt(e.Rating)));
            for (var i = 0; i < Object.keys(rating).length; i++) {
                rating[`${i}`] = rating[`${i}`] ? ((rating[`${i}`] / ratings.length) * 100).toPrecision(3) + '%' : '';
            }
            return { total: ratings.length, average: average.toFixed(1), rating }
        }
        return { total: 0, average: 0 };
    } catch (e) {
        console.log(e)
    }

}

ratingSchema.statics.myRating = async (id, RatedBy, Type) => {

    try {
        let rating = await Rating.findOne({ ...Type === 'Project' ? { ProjectID: id } : { PortfolioID: id }, Type, RatedBy }, { Rating: 1, createdAt: 1 });
        return rating;

    } catch (e) {
        console.log(e)
    }
}

const Rating = mongoose.model('Ratings', ratingSchema);
module.exports = Rating;