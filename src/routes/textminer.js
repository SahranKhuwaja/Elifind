const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const moment = require('moment');
const role = require('../middleware/companyChecker2');
const multer = require('multer');
const { extractText, infoExtractor, cleanData }  = require('../functions/text-mining');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const upload = multer({

  fileFilter(req,file,cb){
    if(!file.originalname.toLowerCase().match(/\.(pdf||doc||docx||txt)$/)){
      return cb(new Error('Please upload relevant document!'));
    }
    cb(undefined,true);
  },
  
  });

router.get('/Profile/SkillDetection',auth,role,async(req,res)=>{
   let image = null;
   if(req.user.Dp){
     image = Buffer.from(req.user.Dp).toString('base64');
   }
   if(req.user.Role === 'Company'){
    return res.render('skillDetection',{company:req.user,image,companyDetails:await req.user.company[0],Pimage:image,created:moment(req.user.createdAt).fromNow(),dob:moment(req.user.Birthday).format('MMMM Do YYYY'),age: Math.floor(moment().diff(req.user.Birthday, 'years')),updated:moment(req.user.updatedAt).fromNow()})
   }
   res.render('skillDetection',{user:req.user,image,Pimage:image,created:moment(req.user.createdAt).fromNow(),dob:moment(req.user.Birthday).format('MMMM Do YYYY'),age: Math.floor(moment().diff(req.user.Birthday, 'years')),updated:moment(req.user.updatedAt).fromNow()});
});

router.post('/Profile/SkillDetection/Detect',auth,role,upload.single('sd-file'),async(req,res)=>{
 
  try{
    const text = await extractText(req.file);
    const info = await infoExtractor(text);
    const data = await cleanData(info);
    res.send(data);
  }
  catch(e){
    console.log(e);
  }
 
})





module.exports = router;