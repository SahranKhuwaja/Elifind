
const express = require('express');
const User = require('../models/user');
const Token = require('../models/token');
const Unique = require('../middleware/unique');
const router = express.Router();
const auth = require('../middleware/auth');
const inomashPresentCheck = require('../middleware/inomashPresentCheck');
const inomashPresentCheck2 = require('../middleware/inomashPresentCheck2');
const multer = require('multer');
const sharp = require('sharp');
const moment = require('moment');
const InoMash = require('../models/inomash');
const path = require('path');
const fs = require('fs-extra');
const puppeteer = require('puppeteer');
const hbs = require('hbs');
const role = require('../middleware/userRole');
const check = require('check-types');



router.use(express.json()); 
router.use(express.urlencoded( {extended: true}));

router.get('/Profile/Inomash',auth,role,async(req,res)=>{

    let image = null;
    let inomash = undefined;
    let created = undefined;
    let updated = undefined;
    let inomashPresent = false;
    if(req.user.Dp){
      image = await Buffer.from(req.user.Dp).toString('base64');
      }


      if(await InoMash.findOne({Owner:req.user._id})){
       
        try{
          await req.user.populate('inomash').execPopulate()
          inomash = await req.user.inomash;
          created = await moment(inomash[0].createdAt).fromNow();
          updated = await moment(inomash[0].updatedAt).fromNow();
          inomashPresent = await true;

        }catch(e){
         
          console.log(e);
          
        }
       
      };
      
    
     
    res.render('inomash',{image,Pimage:image,user:req.user,age: Math.floor(moment().diff(req.user.Birthday, 'years',true)),created,updated,inomashPresent});
  })
  
  
  router.get('/Profile/Inomash/Create',auth,role,inomashPresentCheck,(req,res)=>{
         
    let Pimage = null;
    if(req.user.Dp){
      Pimage = Buffer.from(req.user.Dp).toString('base64');
      }


    res.render('inomashCreation',{Pimage,user:req.user,dob:moment(req.user.Birthday).format('MMMM Do YYYY')});
  
  });

  router.post('/Profile/Inomash/Create',auth,role,async(req,res)=>{


     var data = await InoMash.INOMASH(req.body,req.user._id);
     if(data===true){
      
      res.redirect('/Profile/Inomash');

     }
     else{
       res.redirect('/Profile/Inomash/Create');
     }
     

  });

  router.get('/Profile/Inomash/View',auth,role,inomashPresentCheck2,async(req,res)=>{

   let image = null;
   if(req.user.Dp){
     image = await Buffer.from(req.user.Dp).toString('base64');
   }
   await req.user.populate('inomash').execPopulate();
   
   var ino = {...req.user.inomash[0].toObject()}
   
   for(var i = 0;i<ino.Courses.length;i++){

    ino.Courses[i].sy = await ino.Courses[i].StartYear.getFullYear();
    ino.Courses[i].ey = await ino.Courses[i].EndYear.getFullYear();  
   }
   for(var i = 0;i<ino.WorkExperience.length;i++){

    ino.WorkExperience[i].sy = await ino.WorkExperience[i].StartYear.getFullYear();
    ino.WorkExperience[i].ey = await ino.WorkExperience[i].EndYear.getFullYear();  
   }
   for(var i = 0;i<ino.Skills.length;i++){

    if(ino.Skills[i].GoldenSkill===true){
      ino.Skills[i].gs = "Golden Skill";
    }
    else{
      ino.Skills[i].gs = "Normal Skill"
    }
     
   }

   res.render('viewInomash',{user:ino,image,userInfo:req.user,age:Math.floor(moment().diff(req.user.Birthday,'years')),loginUserInomash:true});


  });

  router.get('/Profile/Inomash/Data',auth,async(req,res)=>{

  
    if(req.query.id){
      
      try{
       
        const data = await User.findById(req.query.id);
        data.Password = undefined;
        await data.populate('inomash').execPopulate();
        return res.send(data.inomash[0].Skills);
  
       }catch(e){
  
       }
         
    }else{
      
      await req.user.populate('inomash').execPopulate();
      return res.send(req.user.inomash[0].Skills);

    }

    
 
 
   });

   router.post('/Profile/Inomash/Delete',auth,role,async(req,res)=>{

    const inomash = await InoMash.findOne({Owner:req.user._id});
    await inomash.remove();
    await inomash.save();

    res.redirect('/Profile/Inomash');


   })

   router.post('/Profile/View/Inomash/Update',auth,role,async (req,res)=>{
     
    if(await req.user.populate('inomash').execPopulate()){
      ino = await req.user.inomash[0];
      let Category = undefined;
      if(check.array(req.body.Category)){

        var cat = await req.body.Category.filter((c)=>{
            return c !="";
        })
        Category = await cat[0];
    
        }else{
         
        Category = await req.body.Category;
    
        }
        

      ino.Skills = await ino.Skills.concat({Skill:req.body.Skill,GoldenSkill:req.body.GoldenSkill,Category,SkillRate:req.body.SkillRate});
      await ino.save();
      req.flash('successSS','Success! Successfully added!')
      res.redirect('/Profile/');
    }


   })

  

module.exports = router;