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

    const rate = await Rating.rate(req.body.id, req.user._id, req.body.rating, req.body.type);
    res.send(rate);
})

router.get('/Profile/Media/Ratings/MyRating', auth, async (req, res) => {
   
    const rating = await Rating.myRating(req.query.id,req.user._id,req.query.type);
    res.send(rating);
})
router.get('/Profile/Media/Ratings', auth, async (req, res) => {

    let data = req.query.projects?req.query.projects:req.query.portfolios;
    let type = req.query.projects?'Project':'Portfolio';
    data = await Promise.all(data.map(async e=>{
        return {...await e,...await Rating.getRatings(e._id,type)}
    }))
    res.send(data);
})

router.get('/Profile/Media/Ratings/Overall', auth, async (req, res) => {
   
    let rating = await Rating.getRatings(req.query.id, req.query.type);
    rating.oneStar = rating.rating['1']
    rating.twoStar = rating.rating['2']
    rating.threeStar = rating.rating['3']
    rating.fourStar = rating.rating['4']
    rating.fiveStar = rating.rating['5']
    delete rating.rating;
    res.send(rating);
})

module.exports = router;