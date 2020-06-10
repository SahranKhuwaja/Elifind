const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const moment = require('moment');
const multer = require('multer');
const User = require('../models/user');
const role = require('../middleware/Role');
const Portfolio = require('../models/portfolio');
const Post = require('../models/post');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.get('/Profile/Portfolios', auth, role, async (req, res) => {
  let image = null;

  if (req.user.Dp) {
    image = Buffer.from(req.user.Dp).toString('base64');
  }
  if (req.user.Role === 'Company') {

    return res.render('portfolios', { company: req.user, image, companyDetails: await req.user.company[0], Pimage: image, age: Math.floor(moment().diff(req.user.Birthday, 'years')) })

  }
  res.render('portfolios', { user: req.user, image, Pimage: image, age: Math.floor(moment().diff(req.user.Birthday, 'years')) });
})

router.post('/Profile/Portfolio/Create', auth, async (req, res) => {

  try {
    const createPortfolio = await Portfolio.createPortfolio(req.user._id, req.body);
    await Post.createPost(req.user._id, {ReferenceID: createPortfolio._id },'Portfolio',undefined,'Private');
    res.send(createPortfolio);

  } catch (e) {
    console.log(e);
  }

});

router.get('/Profile/Portfolios/MyPortfolios/Get', auth, async (req, res) => {

  const user = req.query.userID ? req.query.userID : req.user._id;
  const portfolios = await Portfolio.find({ Owner: user }, { 'Title': 1, 'createdAt': 1 });
  if (portfolios === null) {
    return res.send(null);
  }
  res.send(portfolios.reverse())
})

router.get('/Profile/Portfolios/MyPortfolios/Portfolio/Open', auth, async (req, res) => {

  const user = req.query.userID ? req.query.userID : req.user._id;
  let portfolioData = await Portfolio.findOne({ _id: req.query.id, Owner: user });
  res.send(portfolioData);
})


module.exports = router;