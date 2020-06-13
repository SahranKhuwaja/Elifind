const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const moment = require('moment');
const Post = require('../models/post');
const Inomash = require('../models/inomash');


router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/Profile/Newsfeed', auth, async (req, res) => {

  let image = null;

  if (req.user.Dp) {
    image = Buffer.from(req.user.Dp).toString('base64');
  }
  if (req.user.Role === "Company") {
    await req.user.populate('company').execPopulate();
    return res.render('newsfeed', { companyDetails: req.user.company[0], Pimage: image });

  }
  res.render('newsfeed', { user: req.user, Pimage: image });
});

router.get('/Profile/Newsfeed/Posts', auth, async (req, res) => {

  try {
    let skills = undefined;
    if (req.query.skill === 'true') {
      skills = await Inomash.getSkills(req.user._id);
    }
    const posts = await Post.getPublicPosts(req.query.location === 'true' ? req.user.Country : undefined, skills);
    res.send(posts);
  } catch (e) {
    console.log(e)
  }


})

router.get('/Profile/Newsfeed/Match', auth, async (req, res) => {

  if(req.query.Country && req.query.Skill){
    const getSkills = await Inomash.getSkills(req.user._id);
    return res.send(req.query.Country === req.user.Country && getSkills.includes(req.query.Skill))


  }else if(req.query.Country){
    
    return res.send(req.query.Country === req.user.Country);

  }
  else{

    const getSkills = await Inomash.getSkills(req.user._id);
    return res.send(getSkills.includes(req.query.Skill))
   

  }
  
  res.send(false)

})

module.exports = router;