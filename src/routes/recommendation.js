const express = require('express');
const User = require('../models/user');
const mongoose = require('mongoose');
const router = express.Router();
const auth = require('../middleware/auth');
const { getUsers, getViews, KNN, predictions, getUserInfoForNeighbours, getUserInfoForPredictions, getViewsData, 
        getDataOfMostViewedProfile} = require('../functions/recommendation')

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/Profile/Recommendations/Get', auth, async (req, res) => {

  const Users = await getUsers();
  const Views = await getViews();
  let Predictions = undefined;
  let Neighbours = await KNN(Users, Views, req.user._id);
  if (Neighbours.length !== 0) {
    Predictions = await predictions(Neighbours, req.user._id)
  }
  if(req.query.k){
    Neighbours = await Neighbours.slice(0,parseInt(req.query.k));
    Predictions = await Predictions.slice(0,parseInt(req.query.k))
  }
 
  res.send({ Neighbours, Predictions })
});

router.get('/Profile/Recommendations', auth, async (req, res) => {
  let image = null;

  if (req.user.Dp) {
    image = Buffer.from(req.user.Dp).toString('base64');
  }
  if (req.user.Role === "Company") {
    await req.user.populate('company').execPopulate();
    return res.render('recommendation', { companyDetails: req.user.company[0], Pimage: image });

  }

  res.render('recommendation', { user: req.user, Pimage: image, });
})

router.get('/Profile/Recommendations/User/Data/Fetch', auth, async (req, res) => {
  const neighbours = await getUserInfoForNeighbours(req.query.Neighbours);
  const predictions = await getUserInfoForPredictions(req.query.Predictions);
  res.send({ neighbours, predictions })

})

router.get('/Profile/Recommendations/Get/Views', auth, async (req, res) => {
  const data = await getViewsData(req.user._id);
  res.send(data)
  

})

router.get('/Profile/Recommendations/HighViewed/Data/Fetch', auth, async (req, res) => {

  const data = await getDataOfMostViewedProfile(req.query.profileData)
  res.send(data)
})

module.exports = router;


