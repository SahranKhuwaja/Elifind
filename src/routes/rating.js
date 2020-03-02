const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const moment = require('moment');
const Rating = require('../models/rating');
const ratingCheck = require('../middleware/ratingCheck');
router.use(express.json()); 
router.use(express.urlencoded( {extended: true}));

router.post('/Profile/Media/Rate',auth,ratingCheck,async(req,res)=>{
    let rate;
    if(!req.body.userID){
        rate = await Rating.rate(req.user._id,req.body.id,req.user._id,req.body.rating);
    }
    else{
        rate = await Rating.rate(req.body.userID,req.body.id,req.user._id,req.body.rating);
    }
    res.send(rate);

    
})

router.get('/Profile/Media/Ratings/MyRating',auth,async(req,res)=>{
    let rate;
    if(!req.query.userID){
        rate = await Rating.findOne({Owner:req.user._id,'Ratings.ReferenceID':req.query.id},{'Ratings.$':1});
    }
    else{
        rate = await Rating.findOne({Owner:req.query.userID,'Ratings.ReferenceID':req.query.id},{'Ratings.$':1});
    }
    if(rate){
        return res.send(...await rate.Ratings[0].Rating.filter(e=>e.RatedBy.equals(req.user._id)));
    }
    res.send(null);

})

module.exports = router;