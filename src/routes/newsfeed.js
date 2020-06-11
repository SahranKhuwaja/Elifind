const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const moment = require('moment');
const Post = require('../models/post');


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
    const posts = await Post.getPublicPosts(req.query.location==='true'?req.user.Country:undefined,req.query.skill);
    res.send(posts);
  } catch (e) {
    console.log(e)
  }
 

})

module.exports = router;