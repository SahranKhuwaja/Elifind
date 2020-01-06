const express = require('express');
const User = require('../models/user');
const InoMash = require('../models/inomash');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
const moment = require('moment');
const inomashPresentCheckLast = require('../middleware/inomashPresentCheckLast');
const Company = require('../models/company');
const role = require('../middleware/userRole');
const inomashPresentCheck = require('../middleware/inomashPresentCheck');
const mongoose = require('mongoose');
const upload = multer({

limits:{
  fileSize:1000000
},
fileFilter(req,file,cb){

  if(!file.originalname.toLowerCase().match(/\.(jpg||jpeg||png)$/)){
    return cb(new Error('Please upload image!'));
  }

  cb(undefined,true);


}



});

router.use(express.json()); 
router.use(express.urlencoded( {extended: true}));


router.get('/autocomplete/', async(req, res)=> {

    var regex= await new RegExp(req.query["term"],'i');
   
    var split = await req.query["term"].split(" ");
    var sp1 = await new RegExp(split[0],'i');
    var sp2 = await new RegExp(split[1],'i');
   
    var dataFilter = await User.find({$or: [ {FirstName:regex},{LastName:regex},{FirstName:sp1,LastName:sp2},{FirstName:sp2,LastName:sp1}] },{'FirstName':1,'LastName':1,'Role':1}).sort({"updatedAt":-1}).sort({"createdAt":-1}).limit(6);
    
    var dataFilter2 = await Company.find({CompanyName:regex},{'CompanyName':1,'Owner':1}).sort({"updatedAt":-1}).sort({"createdAt":-1}).limit(6);

      var result=[];
            
           if(dataFilter.length>0){
           
              dataFilter.forEach((user)=>{
             
              if(user.Role !=='Company'){
              let obj={
              id:user._id,
              label:user.FirstName + " " + user.LastName,
              
              }
              
              result.push(obj);
            } 
           });
          }
          if(dataFilter2.length>0){
            dataFilter2.forEach((company)=>{
              let obj={
              id:company.Owner,
              label:company.CompanyName
              
              }
              
              result.push(obj);
            
           });


          }
          if(result.length==0){
     
          result.push({_id:undefined,label:'No suggestions found!'});
  
     }
     res.jsonp(result);
   
  
  });
  
  router.get('/Profile/View/:id/Timeline',auth,async(req,res)=>{
  
    if(req.params.id === (req.user._id).toString()){
  
      return res.redirect('/Profile/Timeline');
    }

    let image = null;
    let Pimage = null;
    let loggedInUser = undefined;
    let data = undefined;
    let age = undefined;
    const userData = await User.findById(req.params.id,{'FirstName':1,'LastName':1,'Birthday':1,'Dp':1,'createdAt':1,'updatedAt':1,'Email':1,'Role':1});

    if(userData.Dp){
  
      image = await Buffer.from(userData.Dp).toString('base64');
    }
  
    if(req.user.Dp){
      Pimage = await Buffer.from(req.user.Dp).toString('base64');
    }

    if(userData.Role==='Company'){

      await userData.populate('company').execPopulate();
      data = await {CompanyName:userData.company[0].CompanyName,Email:userData.Email,_id:userData._id}
      

    }else{
      data = await userData;
      age = await Math.floor(moment().diff(userData.Birthday, 'years'))
    }

    if(req.user.Role ==='Company'){
      await req.user.populate('company').execPopulate();
      loggedInUser = await {CompanyName:req.user.company[0].CompanyName,_id:req.user._id} 
    }
    else{

     loggedInUser = await {FirstName:req.user.FirstName,LastName:req.user.LastName,_id:req.user._id}
     
    }
    
   
    res.render('timeline',{data,image,Pimage,loggedInUser,created:moment(userData.createdAt).fromNow(),updated:moment(userData.updatedAt).fromNow(),age:age });
  
  
  
  });



  router.get('/Profile/View/:id',auth,async(req,res)=>{

    if(req.params.id === (req.user._id).toString()){
  
        return res.redirect('/Profile');
      }

      let image = null;
      let Pimage = null;
      let loggedInUser = undefined;
      let data = undefined;
      const userData = await User.findById(req.params.id,{'FirstName':1,'Gender':1,'Phone':1,'City':1,'Country':1,'LastName':1,'Birthday':1,'Dp':1,'createdAt':1,'updatedAt':1,'Email':1,'Role':1});
  
      if(userData.Dp){
    
        image = await Buffer.from(userData.Dp).toString('base64');
      }
    
      if(req.user.Dp){
        Pimage = await Buffer.from(req.user.Dp).toString('base64');
      }
  
      if(userData.Role==='Company'){
  
        await userData.populate('company').execPopulate();
        
        data = await {...userData.company[0]._doc,Email:userData.Email,_id:userData._id,joined:moment(userData.createdAt).format('LL'),founded:moment(userData.company[0].FoundedOn).format('LL'),Role:userData.Role}
        
      }else{
        data = await userData;
      }
  
      if(req.user.Role ==='Company'){
        await req.user.populate('company').execPopulate();
        loggedInUser = await {CompanyName:req.user.company[0].CompanyName,_id:req.user._id} 
      }
      else{
  
       loggedInUser = await {FirstName:req.user.FirstName,LastName:req.user.LastName,_id:req.user._id}
      }
   
    res.render('profile',{data,image,Pimage,loggedInUser,created:moment(userData.createdAt).fromNow(),updated:moment(userData.updatedAt).fromNow(),age: Math.floor(moment().diff(userData.Birthday, 'years')),dateL:moment(userData.createdAt).format('LL')});
  


  });

  router.get('/Profile/View/:id/Inomash',auth,async(req,res)=>{


    if(req.params.id.toString === (req.user._id).toString()){
  
     return res.redirect('/Profile/Inomash');
     
    }

      let image = null;
      let Pimage = null;
      const data = await User.findById(req.params.id);
      data.Password = undefined;
      let inomash = undefined;
      let created = undefined;
      let updated = undefined;
      let inomashPresent = false;
  
    if(data.Dp){
  
      image = await Buffer.from(data.Dp).toString('base64');
    }
  
    if(req.user.Dp){
      Pimage = await Buffer.from(req.user.Dp).toString('base64');
    }
  
    let loggedInUser = await {FirstName:req.user.FirstName,LastName:req.user.LastName}

  
      if(await InoMash.findOne({Owner:data._id})){
       
        try{
          await data.populate('inomash').execPopulate()
          inomash = await data.inomash;
          created = await moment(inomash[0].createdAt).fromNow();
          updated = await moment(inomash[0].updatedAt).fromNow();
          inomashPresent = await true;

        }catch(e){
         
          console.log(e);
          
        }
       
      };
      

   
    res.render('inomash',{data,image,Pimage,loggedInUser,created,updated,age:Math.floor(moment().diff(data.Birthday, 'years')),inomashPresent});
 


});

router.get('/Profile/View/Inomash/View',auth,inomashPresentCheckLast,async(req,res)=>{
 
   if(req.query.id === (req.user._id).toString()){
      return res.redirect('/Profile/Inomash/View');
   }
  
    const data = await User.findById(req.query.id);
    data.Password = undefined;

    let image = null;
    if(data.Dp){
      image = await Buffer.from(data.Dp).toString('base64');
    }
    await data.populate('inomash').execPopulate();
    
    var ino = {...data.inomash[0].toObject()}
    
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
   
    res.render('viewInomash',{user:ino,image,userInfo:data,age:Math.floor(moment().diff(data.Birthday,'years'))});


});


router.get('/Profile/Search',auth,async(req,res)=>{

    let image = null;

    if(req.user.Dp){
      image = Buffer.from(req.user.Dp).toString('base64');
    }
    if(req.user.Role==="Company"){
      await req.user.populate('company').execPopulate();
      return res.render('search',{companyDetails:req.user.company[0],Pimage:image});

    }

      res.render('search',{user:req.user,Pimage:image});

});

router.get('/Profile/Search/Data',auth,async(req,res)=>{

  var regex= await new RegExp(req.query.search,'i');
  var split = await req.query.search.split(" ");
  var sp1 = await new RegExp(split[0],'i');
  var sp2 = await new RegExp(split[1],'i');
  var dataFilter = null;
  var dataFilter2 = null;
 
  if(req.query.filter==="true"){
  dataFilter = await User.find({$or: [{FirstName:regex},{LastName:regex},{FirstName:sp1,LastName:sp2},{FirstName:sp2,LastName:sp1}],Country:req.user.Country },{'FirstName':1,'LastName':1,'Role':1,'Gender':1,'Dp':1,'Country':1,'City':1,'Role':1,'createdAt':1}).sort({"updatedAt":-1}).sort({"createdAt":-1});
 
  }
  else{

    dataFilter = await User.find({$or: [{FirstName:regex},{LastName:regex},{FirstName:sp1,LastName:sp2},{FirstName:sp2,LastName:sp1}]},{'FirstName':1,'LastName':1,'Role':1,'Gender':1,'Dp':1,'Country':1,'City':1,'Role':1,'createdAt':1}).sort({"updatedAt":-1}).sort({"createdAt":-1});

  }

  dataFilter2 = await Company.find({CompanyName:regex},{'CompanyName':1,'Owner':1}).sort({"updatedAt":-1}).sort({"createdAt":-1});
  
      
    var result=[];
    var noResult = false;
    try{
      
      if(dataFilter.length>0){
       
        dataFilter.forEach(async (user)=>{
        
          if(user.Role !=="Company"){
            let obj={
            id:user._id,
            fname:user.FirstName,
            lname:user.LastName,
            role:user.Role,
            Dp: user.Dp? Buffer.from(user.Dp).toString('base64'):undefined,
            gender:user.Gender,
            city:user.City,
            country:user.Country,
            create:moment(user.createdAt).format('L')
          };
      
          result.push(obj);
          }
     });

    }
    if(dataFilter2.length>0){
       
      for(var company of dataFilter2){
        let u = undefined;
        if(req.query.filter==="true"){
          const u2 = await User.find({_id:company.Owner,Country:req.user.Country},{'Dp':1,'Role':1,'createdAt':1,'City':1});
          u = await u2[0];
        }
        else{
          u = await User.findById(company.Owner,{'Dp':1,'Role':1,'createdAt':1,'City':1});
        }
        if(u.length !==0){
        let obj= await {
          id:company.Owner,
          cname:company.CompanyName,
          role:u.Role,
          gender:'--',
          city:u.City,
          create:moment(u.createdAt).format('L'),
          Dp:u.Dp? await Buffer.from(u.Dp).toString('base64') : undefined
        };

       await result.push(obj);
      }
    }
   

  }


    if(result.length==0){

      noResult = true;

    }
    }catch(e){
    
      

    }
      
     res.send(result);
     


});
  
  
module.exports = router;  
