const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const moment = require('moment');

router.use(express.json()); 
router.use(express.urlencoded( {extended: true}));

router.get('/Profile/Newsfeed',auth,async(req,res)=>{

    let image = null;

    if(req.user.Dp){
      image = Buffer.from(req.user.Dp).toString('base64');
    }
    if(req.user.Role==="Company"){
      await req.user.populate('company').execPopulate();
      return res.render('search',{companyDetails:req.user.company[0],Pimage:image});

    }
      res.render('newsfeed',{user:req.user,Pimage:image});
})

module.exports = router;