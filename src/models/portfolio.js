const mongoose = require('mongoose');
const validator = require('validator');
const sharp = require('sharp');
const moment = require('moment');
const portfolioSchema = new mongoose.Schema({

    Owner:{
        ref:'Users',
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        unique:true
    },
    Portfolios:[{
    Title:{
        type:String,
        required:true,
    },
    Type:{
        type:String,
        required:true
    },
    Category:{
        type:String,
        required:true
    },
    Description:{
        type:String,
        required:true
    },
    Projects:[{
        Title:{
            type:String,
            required:true,
        },
        Type:{
            type:String,
            required:true
        },
        Category:{
            type:String,
            required:true
        },
        Technology:{
            type:String,
            required:true
        },
        Description:{
            type:String,
            required:true
        },
        GitLink:{
            type:String,
        },
        Tags:{
            type:String
          
        },
        Project:{
            Images:[{
                image:{
                  type:Buffer,
                  required:true
                },
                createdAt:{
                  type:Date,
                  default:Date.now
                }
            }],
            Videos:[{
                video:{
                  type:Buffer,
                  required:true
                },
                createdAt:{
                  type:Date,
                  default:Date.now
                }
            }],
           
        },
        createdAt:{
            type:Date,
            default:Date.now
        
        },
        updatedAt:{
            type:Date,
            default:Date.now
        }
    }],
    createdAt:{
        type:Date,
        default:Date.now
    
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
}]
});

portfolioSchema.statics.createPortfolio = async(id,data)=>{

    try{
       let createPortfolio = await Portfolio.findOne({Owner:id});
       if(!createPortfolio){
           createPortfolio = new Portfolio({Owner:id})
       }
       createPortfolio.Portfolios = await  createPortfolio.Portfolios.concat(data);
       await createPortfolio.save();

       return createPortfolio.Portfolios.filter((objData)=>{
           objData.Projects = undefined;
           return objData.Title === data.Title;
       })  
    }
    catch(e){
        console.log(e);
    }
}

portfolioSchema.statics.createProject = async(id,userID,data)=>{
   
    const project = await Portfolio.findOne({Owner:userID,'Portfolios._id':id},{'Portfolios.$':1})
    project.Portfolios[0].Projects = await project.Portfolios[0].Projects.concat(data);
    await Portfolio.updateOne({Owner:userID,'Portfolios._id':id},{$set:{'Portfolios.$.Projects':project.Portfolios[0].Projects,'Portfolios.$.updatedAt':Date.now()}});
    return project.Portfolios[0].Projects.filter((e)=>{
        e.Project = undefined;
        return e.Title === data.Title;
    })
    
}

portfolioSchema.statics.updateAlbum = async(files,projectId,userId)=>{

    let project = await Portfolio.findOne({Owner:userId,'Portfolios.Projects._id':projectId},{'Portfolios.Projects.$':1});
    let projectData = await project.Portfolios[0].Projects.filter(e=>e._id.toString()===projectId);
    for(var i=0;i<files.length;i++){

       projectData[0].Project.Images = await  projectData[0].Project.Images.concat({image:await sharp(files[i].buffer).png().toBuffer()});
    
     }
    projectData[0].updatedAt = await Date.now();
    await project.save();
    
    let recentAdded = []
    let reverse = await projectData[0].Project.Images.reverse().map((e)=>e);
    for(var i=0;i<files.length;i++){
     
        recentAdded.push({image:await Buffer.from(reverse[i].image).toString('base64'),_id:reverse[i]._id,created:moment(reverse[i].createdAt).fromNow()})

     } 
     return recentAdded;
}

portfolioSchema.statics.updateVideos = async(files,projectId,userId)=>{

    let project = await Portfolio.findOne({Owner:userId,'Portfolios.Projects._id':projectId},{'Portfolios.Projects.$':1});
    let projectData = await project.Portfolios[0].Projects.filter(e=>e._id.toString()===projectId);
   
    for(var i=0;i<files.length;i++){

       projectData[0].Project.Videos = await  projectData[0].Project.Videos.concat({video:await files[i].buffer});
    
     }
    projectData[0].updatedAt = await Date.now();
    await project.save();
    
    let recentAdded = []
    let reverse = await projectData[0].Project.Videos.reverse().map((e)=>e);
    for(var i=0;i<files.length;i++){
     
        recentAdded.push({video:await Buffer.from(reverse[i].video).toString('base64'),_id:reverse[i]._id,created:moment(reverse[i].createdAt).fromNow()})

     } 
     return recentAdded;
}



const Portfolio = mongoose.model('Portfolios',portfolioSchema);
module.exports = Portfolio;