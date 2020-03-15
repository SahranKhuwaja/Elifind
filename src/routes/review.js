const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const moment = require('moment');
const Review = require('../models/review');
const reviewCheck = require('../middleware/reviewCheck');
const lodash = require('lodash');
router.use(express.json()); 
router.use(express.urlencoded( {extended: true}));

router.post('/Profile/Media/Review',auth,reviewCheck,async(req,res)=>{
    const user = req.body.userID ? req.body.userID : req.user._id;
    const review = await Review.review(user,req.body.id,req.user._id,req.body.review,req.body.type);
    res.send(review);
})

router.get('/Profile/Media/Reviews',auth,async(req,res)=>{
   try{
      const user = req.query.userID ? req.query.userID : req.user._id;
      let reviews = await Review.findOne({Owner:user,'Reviews.ReferenceID':req.query.id},{'Reviews.$':1});
      if(reviews !==null){
          let reviewArray = [];
          let alreadyReviewed = false;
         for(var i=0;i<reviews.Reviews[0].Review.length;i++){
             
             reviewArray.push({...await Review.reviewedBy(reviews.Reviews[0].Review[i].ReviewedBy,user,req.query.id,req.user._id),
             Review:reviews.Reviews[0].Review[i].Review,time:await moment(reviews.Reviews[0].Review[i].createdAt).fromNow(),})
         }
         return res.send(reviewArray)
     }
     res.send(null);
    }catch(e){
        console.log(e);
    }

})


module.exports = router;