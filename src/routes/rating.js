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
    let user = req.user._id;
    if(req.body.userID) {
        user = req.body.userID
    }
    const rate = await Rating.rate(user, req.body.id, req.user._id, req.body.rating, req.body.type);
    res.send(rate);
})

router.get('/Profile/Media/Ratings/MyRating', auth, async (req, res) => {
    let user = req.user._id;
    if(req.query.userID) {
        user = req.query.userID;
    }
    const rate = await Rating.findOne({Owner:user, 'Ratings.ReferenceID': req.query.id }, { 'Ratings.$': 1 });
    if (rate) {
        return res.send(...await rate.Ratings[0].Rating.filter(e => e.RatedBy.equals(req.user._id)));
    }
    res.send(null);
})
router.get('/Profile/Media/Ratings', auth, async (req, res) => {

    let user = req.user._id
    if (req.query.userID) {
        user = req.query.userID
    }
    for (var i = 0; i < req.query.projects.Projects.length; i++) {
        req.query.projects.Projects[i].Ratings = await Rating.getRatings(user, req.query.projects.Projects[i]._id)
    }
    res.send(req.query.projects);
})

router.get('/Profile/Media/Ratings/Overall', auth, async (req, res) => {
    let user = req.user._id
    if (req.query.userID) {
        user = req.query.userID;
    }
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