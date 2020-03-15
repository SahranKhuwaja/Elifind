const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const moment = require('moment');
const Rating = require('../models/rating');
const ratingCheck = require('../middleware/ratingCheck');
const lodash = require('lodash');
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/Profile/Media/Rate', auth, ratingCheck, async (req, res) => {
    const user = req.body.userID ? req.body.userID : req.user._id;
    const rate = await Rating.rate(user, req.body.id, req.user._id, req.body.rating, req.body.type);
    res.send(rate);
})

router.get('/Profile/Media/Ratings/MyRating', auth, async (req, res) => {
    const user = req.query.userID ? req.query.userID : req.user._id;
    const rate = await Rating.findOne({Owner:user, 'Ratings.ReferenceID': req.query.id }, { 'Ratings.$': 1 });
    if (rate) {
        return res.send(...await rate.Ratings[0].Rating.filter(e => e.RatedBy.equals(req.user._id)));
    }
    res.send(null);
})
router.get('/Profile/Media/Ratings', auth, async (req, res) => {

    const user = req.query.userID ? req.query.userID : req.user._id;
    let data = req.query.projects?req.query.projects.Projects:req.query.portfolios.Portfolios;

    for (var i = 0; i < data.length; i++) {
        data[i].Ratings = await Rating.getRatings(user, data[i]._id)
    }
    res.send(req.query.projects?req.query.projects:req.query.portfolios);
})

router.get('/Profile/Media/Ratings/Overall', auth, async (req, res) => {
    const user = req.query.userID ? req.query.userID : req.user._id;
    let rating = await Rating.getRatings(user, req.query.id);
    rating.oneStar = rating.rating['1']
    rating.twoStar = rating.rating['2']
    rating.threeStar = rating.rating['3']
    rating.fourStar = rating.rating['4']
    rating.fiveStar = rating.rating['5']
    delete rating.rating;
    res.send(rating);
})

module.exports = router;