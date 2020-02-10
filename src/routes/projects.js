const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const moment = require('moment');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');
const role = require('../middleware/Role');
const Project = require('../models/project');

router.use(express.json()); 
router.use(express.urlencoded( {extended: true}));

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

       const CreateProject = await Project.CreateProject(req.user._id,req.body);
       if(Object.entries(CreateProject).length === 0){

           return res.send({});
       }
       res.send(CreateProject);

    }catch(e){
       console.log(e);
    }
    

});

router.get('/Profile/Projects/MyProjects/Get',auth,async(req,res)=>{


    const projects = await Project.find({Owner:req.user._id},{'Projects.Title':1,'Projects._id':1});
    if(projects.length===0){
        return res.send({});
    }
    
    res.send(...projects)



})

router.get('/Profile/Projects/MyProjects/Project/Open',auth,async(req,res)=>{

    const project = await Project.findOne({Owner:req.user._id});
  
    res.send(await project.Projects.filter((data)=>{

        return  data._id.toString() === req.query.id;
    })
    );
      
})

module.exports = router;