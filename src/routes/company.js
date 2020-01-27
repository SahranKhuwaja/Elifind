const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const moment = require('moment');
const companyChecker = require('../middleware/companyChecker');
const Company = require('../models/company');
const role = require('../middleware/companyChecker2');


router.use(express.json()); 
router.use(express.urlencoded( {extended: true}));

router.get('/Profile/Company',auth,companyChecker,role,async (req,res)=>{

 res.render('company');


});

router.post('/Profile/Company',auth,companyChecker,role,async(req,res)=>{

    const data = await Company.CompanyDetails(req.body,req.user._id);
    if(data){
        res.redirect('/Profile/Timeline');
    }

});

router.post('/Profile/Company/Specialization',auth,role,async(req,res)=>{

   
   req.user.company[0].Specialization = await  req.user.company[0].Specialization.concat({SpecializedIn:req.body.SpecializedIn});
   await req.user.company[0].save();
   req.flash('successSpec','Successfully added!');
   res.redirect('/Profile/');

});


router.post('/Profile/Company/UpdateDetails',auth,role,async(req,res)=>{

    req.user.company[0].CompanyName = await req.body.CompanyName;
    req.user.company[0].Contact = await req.body.Contact;
    req.user.company[0].Address = await req.body.Address;
    req.user.company[0].Details = await req.body.Details;
    await req.user.company[0].save();
    res.redirect('/Profile');


});



module.exports = router;