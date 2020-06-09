const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const auth = require('../middleware/auth');
const View = require('../models/views');

router.use(express.json()); 
router.use(express.urlencoded( {extended: true}));


router.post('/Profile/View/Visit',auth,async(req,res)=>{
      
    const status = await View.visit({Visitor:req.user._id,...req.body})
    res.send(status);

})


module.exports = router;


