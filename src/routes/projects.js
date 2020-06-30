const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const moment = require('moment');
const multer = require('multer');
const role = require('../middleware/Role');
const Project = require('../models/project');
const Portfolio = require('../models/portfolio');
const Post = require('../models/post');
const Image = require('../models/image');
const Video = require('../models/video');
const {imageStorage,videoStorage} = require('../functions/gridFs');
const Review = require('../models/review');
const {sentimentAnalysis} = require('../functions/sentiment-analyzer');
require('../db/mongoose');

router.use(express.json()); 
router.use(express.urlencoded( {extended: true}));



const uploadI = multer({

    limits:{
      fileSize:1000000000000,
      fieldSize:1000000000000
    },
    fileFilter(req,file,cb){
      if(!file.originalname.toLowerCase().match(/\.(jpg||jpeg||png||gif)$/)){
        return cb(new Error('Please upload an image!'));
      }
    
      cb(undefined,true);
    },
    storage:imageStorage
    
    });

    const uploadV = multer({

        fileFilter(req,file,cb){
          if(!file.originalname.toLowerCase().match(/\.(webm||mpg||mp2||mpeg||mpe||mpv||ogg||mp4||m4p||m4v||avi||wmv||mov||qt||flv||swf||avchd||3gp)$/)){
            return cb(new Error('Please upload video!'));
          }
          cb(undefined,true);
    
        },
        storage:videoStorage
        
    });

router.get('/Profile/Projects',auth,role,async(req,res)=>{
    

    let image = null;
    if(req.user.Dp){
    image = Buffer.from(req.user.Dp).toString('base64');
    }
    if(req.user.Role === 'Company'){
  
        return res.render('projects',{company:req.user,image,companyDetails:await req.user.company[0],Pimage:image,age: Math.floor(moment().diff(req.user.Birthday, 'years'))})
    
    }
    

    res.render('projects',{user:req.user,image,Pimage:image,age: Math.floor(moment().diff(req.user.Birthday, 'years'))});
})

router.post('/Profile/Projects/Create',auth,async(req,res)=>{

    try{

       const createProject = await Project.createProject(req.user._id,req.body.createProject);
       await Post.createPost(req.user._id,[{ReferenceID:createProject._id}],req.body.postType,undefined,undefined,'Private');
       if(createProject.PortfolioID!==undefined){
        await Portfolio.updateOne({_id:createProject.PortfolioID},{$set:{updatedAt:Date.now()}})
       }
       res.send(createProject);

    }catch(e){
       console.log(e);
    }
    

});

router.get('/Profile/Projects/MyProjects/Get',auth,async(req,res)=>{
    const user = req.query.userID ? req.query.userID : req.user._id;
    const projects = await Project.find({Owner:user,IsPortfolioProject:req.query.IsPortfolioProject,
        PortfolioID:req.query.id!==undefined?req.query.id:null},{'Title':1,'createdAt':1});
    if(projects === null){
        return res.send(null);
    }
    res.send(projects.reverse())
})

router.get('/Profile/Projects/MyProjects/Project/Open',auth,async(req,res)=>{

    const user = req.query.userID!==undefined ? req.query.userID : req.user._id;
    let projectData = await Project.findOne({IsPortfolioProject:req.query.IsPortfolioProject,_id:req.query.id,Owner:user,
    PortfolioID:req.query.portfolioID!==undefined?req.query.portfolioID:null});
    res.send(projectData);
})

router.post('/Profile/Projects/Album/Upload',auth,uploadI.any('file'),async(req,res)=>{

    try{
        const images = await Image.upload(req.body.id,req.files);
        let posts=[];
        await images.forEach(async e => {
           posts.push({ReferenceID:req.body.id,MediaID:e._id})
        });
        const category = await Project.getCategory(req.body.id)
        const post = await Post.createPost(req.user._id,posts,req.query.portfolio?'Portfolio/Project/Images':'Project/Images',category.Category,
        req.user.Country,'Public');
        await Project.updateOne({_id:req.body.id},{$set:{updatedAt:Date.now()}})
        res.send({images,post});
   
    }catch(e){
        console.log(e);
    }
})

router.post('/Profile/Projects/Video/Upload',auth,uploadV.any('file'),async(req,res)=>{

    try{
      const videos = await Video.upload(req.body.id,req.files);
      let posts=[];
      await videos.forEach(async e => {
         posts.push({ReferenceID:req.body.id,MediaID:e._id});
      });
      const category = await Project.getCategory(req.body.id)
      const post = await Post.createPost(req.user._id,posts,req.query.portfolio?'Portfolio/Project/Videos':'Project/Videos',category.Category,
      req.user.Country,'Public');
      await Project.updateOne({_id:req.body.id},{$set:{updatedAt:Date.now()}})
      res.send({videos,post});
    
     }catch(e){
         console.log(e);
     }
})

router.get('/Profile/SentimentAnalyzer',auth,async(req,res)=>{
    try{

        let reviews;
        if(req.query.type==='project'){
            reviews = await Review.find({ProjectID:req.query.id});
        }
        else{
            reviews = await Review.find({PortfolioID:req.query.id});
        }
        let analysis = [];
        if(reviews.length!==0){
             analysis = await Promise.all(reviews.map(async e=>{
                return {review:e.Review,score:await sentimentAnalysis(e.Review)};
            }))
        }
        res.send(analysis)

    }catch(e){

    }
})

module.exports = router;