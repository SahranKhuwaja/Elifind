const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const moment = require('moment');
const role = require('../middleware/companyChecker2');
const role2 = require('../middleware/hiredBy');
const Hire = require('../models/hire');
const Company = require('../models/company');

router.use(express.json()); 
router.use(express.urlencoded( {extended: true}));

router.post('/Profile/Hire',auth,role,async(req,res)=>{

    try{
        const check = await Hire.findOne({User:req.body.id});
        if(!check){
        const hire = new Hire({HiredBy:req.user._id,User:req.body.id});
        await hire.save();
        return res.send(true);
        }
        res.send(false);
    }
    catch(e){
        console.log(e);
    }

});

router.get('/Profile/Hire',auth,role,async(req,res)=>{

try{
const check = await Hire.findOne({User:req.query.id},{HiredBy:1});
if(check){
  if(check.HiredBy.equals(req.user._id)){

    return res.send(true);

  }else{

    return res.send("Not hired by me!");

  }
}

res.send(false);

}catch(e){
    console.log(e);
}


});

router.post('/Profile/Unhire',auth,role,async(req,res)=>{

  try{

    const check = await Hire.findOne({HiredBy:req.user._id,User:req.body.id});
    if(check){
      await check.remove();
      await check.save();
      return res.send(true);
    }

    res.send(false);

  }
  catch(e){

    console.log(e);
  }

});

router.get('/Profile/HiredBy',auth,role2,async(req,res)=>{

    try{
      
      const hireData = await Hire.findOne({User:req.query.id},{HiredBy:1});
      if(hireData){
         const company =  await Company.findOne({Owner:hireData.HiredBy},{CompanyName:1,Owner:1});
         return res.send({data:true,company});
      }
      res.send({data:false});
      
    }catch(e){
      console.log(e);
    }

});

router.post('/Profile/Leave',auth,role2,async(req,res)=>{
    
    try{

      const check = await Hire.findOne({User:req.body.id});
      if(check){
        await check.remove();
        await check.save();
        return res.send(true);
      }
      return false;

    }catch(e){
      console.log(e);
    }



});

module.exports = router;