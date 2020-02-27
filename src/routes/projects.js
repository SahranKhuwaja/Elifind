const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const moment = require('moment');
const multer = require('multer');
const User = require('../models/user');
const role = require('../middleware/Role');
const Project = require('../models/project');

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

       const createProject = await Project.createProject(req.user._id,req.body);
       if(Object.entries(createProject).length === 0){

           return res.send({});
       }
       res.send(createProject);

    }catch(e){
       console.log(e);
    }
    

});

router.get('/Profile/Projects/MyProjects/Get',auth,async(req,res)=>{

    let projects = undefined;
    if(!req.query.userID){
        projects = await Project.findOne({Owner:req.user._id},{'Projects.Title':1,'Projects._id':1,'Projects.createdAt':1});
    }
    else{
        projects = await Project.findOne({Owner:req.query.userID},{'Projects.Title':1,'Projects._id':1,'Projects.createdAt':1});
    }

    if(projects === null){
        return res.send({});
    }
    res.send(projects)



})

router.get('/Profile/Projects/MyProjects/Project/Open',auth,async(req,res)=>{

    let projectData = undefined;
    if(!req.query.userID){
        
        projectData = await Project.findOne({Owner:req.user._id,'Projects._id':req.query.id},{'Projects.$':1});
    }
    else{
        
        projectData = await Project.findOne({Owner:req.query.userID,'Projects._id':req.query.id},{'Projects.$':1});
    }
   projectData = await {...projectData.toObject()}
    res.send(await projectData.Projects.filter(async(data)=>{
           await data.Project.Images.reverse().filter(async(e)=>{
               return await Buffer.from(e.image).toString('base64');
           })
           await data.Project.Videos.reverse().filter(async(e)=>{
               return await Buffer.from(e.video).toString('base64');
        })
       
        
          
    })
    );
      
})


router.post('/Profile/Projects/Album/Upload',auth,upload.any('file'),async(req,res)=>{

    try{
   
       const status = await Project.updateAlbum(req.files,req.body.id,req.user._id);
       if(status ===null){
           return res.sendStatus(500);
       }

       res.send(status);
   
    }catch(e){
        console.log(e);
    }
})

router.post('/Profile/Projects/Video/Upload',auth,uploadV.any('file'),async(req,res)=>{

    try{
        const status = await Project.updateVideos(req.files,req.body.id,req.user._id);
        if(status ===null){
            return res.sendStatus(500);
        }
 
        res.send(status);
    
     }catch(e){
         console.log(e);
     }
})

module.exports = router;