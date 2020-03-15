const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const moment = require('moment');
const multer = require('multer');
const User = require('../models/user');
const role = require('../middleware/Role');
const Project = require('../models/project');
const Portfolio = require('../models/portfolio');
const Post = require('../models/post');

router.use(express.json()); 
router.use(express.urlencoded( {extended: true}));

const upload = multer({

    limits:{
      fileSize:1000000000000,
      fieldSize:1000000000000
    },
    fileFilter(req,file,cb){
      if(!file.originalname.toLowerCase().match(/\.(jpg||jpeg||png||gif)$/)){
        return cb(new Error('Please upload an image!'));
      }
    
      cb(undefined,true);
    }
    
});

const uploadV = multer({

        limits:{
            fileSize:1000000000000,
            fieldSize:1000000000000
        },
        fileFilter(req,file,cb){
          if(!file.originalname.toLowerCase().match(/\.(webm||mpg||mp2||mpeg||mpe||mpv||ogg||mp4||m4p||m4v||avi||wmv||mov||qt||flv||swf||avchd||3gp)$/)){
            return cb(new Error('Please upload video!'));
          }
          cb(undefined,true);
    
        }
        
});

router.get('/Profile/Portfolios',auth,role,async(req,res)=>{
    let image = null;

    if(req.user.Dp){
    image = Buffer.from(req.user.Dp).toString('base64');
    }
    if(req.user.Role === 'Company'){
  
        return res.render('portfolios',{company:req.user,image,companyDetails:await req.user.company[0],Pimage:image,age: Math.floor(moment().diff(req.user.Birthday, 'years'))})
    
    }
    res.render('portfolios',{user:req.user,image,Pimage:image,age: Math.floor(moment().diff(req.user.Birthday, 'years'))});
})

router.post('/Profile/Portfolio/Create',auth,async(req,res)=>{
 
   try{
     const createPortfolio = await Portfolio.createPortfolio(req.user._id,req.body);
     if(Object.entries(createPortfolio).length === 0){

         return res.send(null);
     }
     await Post.createPost(req.user._id,{Type:'Portfolio',ReferenceID:createPortfolio[0]._id,Visibility:'Private'});
     res.send(createPortfolio);

   }catch(e){
    console.log(e);
   }

});

router.get('/Profile/Portfolios/MyPortfolios/Get',auth,async(req,res)=>{

  const user = req.query.userID ? req.query.userID : req.user._id;
  const portfolios = await Portfolio.findOne({Owner:user},{'Portfolios.Title':1,'Portfolios._id':1,'Portfolios.createdAt':1});
  if(portfolios === null){
      return res.send(null);
  }
  res.send(portfolios);
})

router.get('/Profile/Portfolios/MyPortfolios/Portfolio/Open',auth,async(req,res)=>{

  const user = req.query.userID ? req.query.userID : req.user._id;
  const portfolioData = await Portfolio.findOne({Owner:user,'Portfolios._id':req.query.id},{'Portfolios.$':1});
  await portfolioData.Portfolios[0].Projects.filter(e=>e.Project = undefined);
  res.send(portfolioData.Portfolios[0]);
})

router.post('/Profile/Portfolios/Projects/Create',auth,async(req,res)=>{
  try{
  const createProject = await Portfolio.createProject(req.body.portfolioID,req.user._id,req.body.createProject);
  if(Object.entries(createProject).length===0){
    return res.send(null);
  }
  await Post.createPost(req.user._id,{Type:'Portfolio/Project',ReferenceID:createProject[0]._id,Visibility:'Private'});
  res.send(createProject)
  }
  catch(e){
    console.log(e);
  }
  
})

router.get('/Profile/Portfolios/MyPortfolios/Project/Open',auth,async(req,res)=>{

  const user = req.query.userID ? req.query.userID : req.user._id;
  let projectData = await Portfolio.findOne({Owner:user,'Portfolios._id':req.query.portfolioID,'Portfolios.Projects._id':req.query.id},{'Portfolios.Projects.$._id':1}); 
  projectData = await {Projects:projectData.Portfolios[0].Projects.filter(e=>e._id.toString() === req.query.id).toObject()};
  res.send(await projectData.Projects.filter(async(data)=>{
           await data.Project.Images.reverse().filter(async(e)=>{
               return await Buffer.from(e.image).toString('base64');
           })
           await data.Project.Videos.reverse().filter(async(e)=>{
               return await Buffer.from(e.video).toString('base64');
        })
      
    })
  );
      
});

router.post('/Profile/Portfolios/Projects/Album/Upload',auth,upload.any('file'),async(req,res)=>{

   try{
      const status = await Portfolio.updateAlbum(req.files,req.body.id,req.user._id);
      if(status ===null){
          return res.sendStatus(500);
      }
      let post=[];
      await status.reverse().forEach(async e => {
          post.push({Type:'Portfolio/Project/Image',ReferenceID:req.body.id,MediaID:e._id,Visibility:'Public',})
      });
      await Post.createPost(req.user._id,post);
      res.send(status);

   }catch(e){
      console.log(e);
 }

});

router.post('/Profile/Portfolios/Projects/Videos/Upload',auth,uploadV.any('file'),async(req,res)=>{

  try{
     const status = await Portfolio.updateVideos(req.files,req.body.id,req.user._id);
     if(status ===null){
         return res.sendStatus(500);
     }
     let post=[];
     await status.reverse().forEach(async e => {
          post.push({Type:'Portfolio/Project/Video',ReferenceID:req.body.id,MediaID:e._id,Visibility:'Public',})
     });
     await Post.createPost(req.user._id,post);
     res.send(status);

  }catch(e){
     console.log(e);
}

})


module.exports = router;