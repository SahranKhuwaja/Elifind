const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const moment = require('moment');
const Review = require('../models/review');
const reviewCheck = require('../middleware/reviewCheck');
const lodash = require('lodash');
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/Profile/Media/Review', auth, reviewCheck, async (req, res) => {
    const review = await Review.review(req.body.id, req.user._id, req.body.review, req.body.type);
    res.send(review);
})

router.get('/Profile/Media/Reviews', auth, async (req, res) => {
    try {

        const reviews = await Review.getReviews(req.query.id, req.query.type, req.user._id);
        res.send(reviews);


    } catch (e) {
        console.log(e);
    }

})


module.exports = router;