const express = require('express');
const User = require('../models/user');
const Token = require('../models/token');
const CountryData = require('../countries/country');
const Unique = require('../middleware/unique');
const session = require('express-session');
const mongoose = require('mongoose');
const sessionStore = require('connect-mongo')(session);
const router = express.Router();
const auth = require('../middleware/auth');
const AlreadyloggedInChecker = require('../middleware/AlreadyloggedInChecker');
const multer = require('multer');
const sharp = require('sharp');
const moment = require('moment');
const passChecker = require('../middleware/passChecker');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
var smtptransport = require('nodemailer-smtp-transport');
const role = require('../middleware/Role');
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

router.use(session({

  store:new sessionStore({mongooseConnection:mongoose.connection}),
  name:'sid',
  resave:false,
  saveUninitialized:false,
  secret:process.env.SSECRECT,
  maxAge:86400000 ,

  cookie:{
    maxAge:86400000,
    sameSite:true,
    secure:false
  }




}));


router.get('',AlreadyloggedInChecker,(req,res)=>{
  res.render('index');
})


router.get('/Signup',AlreadyloggedInChecker,(req,res)=>{
    
    res.render('signup',{CountryData,message:req.flash('signupError')});
})

router.post('/Signup',Unique,async (req,res)=>{
   
 

  const user = new User(req.body);
  try{

   await user.save();
   const token = await user.generateAuthToken();
   req.session.token = await token;

   res.redirect('/Profile/Timeline');
   
  }
  catch(e){
      res.send(e);
      
  }
})
 
router.get('/Login',AlreadyloggedInChecker,(req,res)=>{
       res.render('login',{errorMessage:req.flash('error')});
});

router.post('/Login',async(req,res)=>{
 
try{

  const result = await User.checkCredentials(req.body.Email,req.body.Password);
  if(!result){
    req.flash('error','Invalid Email/Password!');
    return res.redirect('/Login');
  }
  const token = await result.generateAuthToken();
  req.session.token = await token;

  res.redirect('/Profile/Timeline');


}catch(e){

  res.send(e);
}


})

router.get('/Profile',auth,role,async(req,res)=>{
  
  let image = null;
  
 

  if(req.user.Dp){
  image = Buffer.from(req.user.Dp).toString('base64');
  }

  if(req.user.Role === 'Company'){
  
    return res.render('profile',{company:req.user,image,companyDetails:await req.user.company[0],Pimage:image,founded:moment(await req.user.company[0].FoundedOn).format('LL'),join:moment(req.user).format('LL'),created:moment(req.user.createdAt).fromNow(),dob:moment(req.user.Birthday).format('MMMM Do YYYY'),age: Math.floor(moment().diff(req.user.Birthday, 'years')),updated:moment(req.user.updatedAt).fromNow(),error:req.flash('error'),success:req.flash('success'),successS:req.flash('successSpec')})

  }
  let skills = undefined;
  await req.user.populate('inomash').execPopulate();
   if(req.user.inomash[0]){
     skills = await req.user.inomash[0].Skills;
   }
  
  res.render('profile',{user:req.user,image,Pimage:image,created:moment(req.user.createdAt).fromNow(),dob:moment(req.user.Birthday).format('MMMM Do YYYY'),age: Math.floor(moment().diff(req.user.Birthday, 'years')),CountryData,dpt:moment(req.user.Birthday).format('YYYY-MM-DD'),updated:moment(req.user.updatedAt).fromNow(),error:req.flash('error'),success:req.flash('success'),skills,successSS:req.flash('successSS')});


});

router.get('/Profile/Timeline',auth,role,async(req,res)=>{
  
  let image = null;
  
 
  if(req.user.Dp){
  image = Buffer.from(req.user.Dp).toString('base64');
  }
  
  if(req.user.Role === 'Company'){
  
    return res.render('timeline',{company:req.user,image,companyDetails:await req.user.company[0],Pimage:image,created:moment(req.user.createdAt).fromNow(),dob:moment(req.user.Birthday).format('MMMM Do YYYY'),age: Math.floor(moment().diff(req.user.Birthday, 'years')),updated:moment(req.user.updatedAt).fromNow()})

  }


  res.render('timeline',{user:req.user,image,Pimage:image,created:moment(req.user.createdAt).fromNow(),dob:moment(req.user.Birthday).format('MMMM Do YYYY'),age: Math.floor(moment().diff(req.user.Birthday, 'years')),updated:moment(req.user.updatedAt).fromNow()});


});


router.post('/Upload',auth,upload.single('dp'),async(req,res)=>{

    const buffer = await sharp(req.file.buffer).resize(300,300).png().toBuffer();
    const user = await User.findById(req.user._id);
    user.Dp = await  buffer;
    await user.save();
    res.redirect('/Profile/Timeline');
   
});

router.post('/UpdateInfo',auth,async(req,res)=>{

  try{
  const user = await User.findByIdAndUpdate(req.user._id,req.body)
  user.save();
 
  res.redirect('/Profile');
  }
  catch(e){
     res.redirect('/Profile');
  }

})

router.post('/UpdatePassword',auth,passChecker,async(req,res)=>{

  try{
    
   
    req.user.Password = req.body.Password;
    await req.user.save();
    req.flash('success','Success! Password Successfully Updated!')
    res.redirect('Profile');

  }catch(e){
    res.send(e);
  }

});

router.post('/Logout',auth,async(req,res)=>{
  
     try{

      let token = await Token.findOne({Owner:req.user._id});    
      token.Token = token.Token.filter((value)=>{

         return value.token !== req.session.token;

      });

       
      
      await token.save();
      req.session.token = await null;
      await req.session.destroy();
       res.redirect('/Login');



     }catch(e){
       console.log(e)
      //res.redirect('/Login');
     }


})

router.get('/Forgot',(req,res)=>{

  res.render('forgotPassword',{errorMessage:req.flash('userCheck'),successMessage:req.flash('successE')});

});

router.post('/Forgot',async(req,res)=>{
  
  try{
  const user = await User.findOne({Email:req.body.Email});
   
  if(!user){
    req.flash('userCheck','No Account with this email exists or email is invalid!');
    return res.redirect('/Forgot');
  }
  const token = await crypto.randomBytes(40);

  user.ForgetPasswordToken = await  token.toString('hex');
  user.FPTokenExpires = await Date.now() + 60 * 60 * 1000;
  user.save();
 

var transporter = nodemailer.createTransport({
  
  service:'gmail',
  auth: {
    user: 'elifindkhuwaja@gmail.com',
    pass: 'lionking786'
  }
});


  var mailOptions = {
     to:user.Email,
     from:`ELIFIND < elifindkhuwaja@gmail.com >`,
     subject:'ELIFIND Password Reset Token',
     text:'You have requested for password reset token. \n\n' +
     'Please click on the link to reset your password. \n\n' +
     `https://elifind-app.herokuapp.com//Reset/${token.toString('hex')}`


  };
 

  await transporter.sendMail(mailOptions,(err,success)=>{

     if(err){
       return console.log(err);
     }

  req.flash('successE',`Password reset token has been sent to your email ${user.Email}`);
  res.redirect('/Forgot')


  });


  }catch(e){
    console.log(e);
  }
});


router.get('/Reset/:token',async(req,res)=>{

  const user = await User.findOne({ForgetPasswordToken:req.params.token,FPTokenExpires:{$gt:Date.now()}});
  console.log(!user);
  if(!user){
    
    req.flash('userCheck2','Password reset token has expired or invalid!');
    return res.redirect('/Forgot');
  }

  res.render('reset',{successMessage:req.flash('successE')});

});

router.post('/Reset/:token',async(req,res)=>{

     const user = await User.findOne({ForgetPasswordToken:req.params.token,FPTokenExpires:{$gt:Date.now()}});
     if(!user){
       
       req.flash('userCheck','Token has been expired or invalid!');
       return res.redirect('/Forgot');
     }

     user.Password = await req.body.Password;
     await user.save();
     req.flash('successE','Success! Your password has been successfully updated!')
     res.redirect('/Reset/'+req.params.token);
})




 module.exports = router;