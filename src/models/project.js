const mongoose = require('mongoose');
const validator = require('validator');
const sharp = require('sharp');
const moment = require('moment');
const projectSchema = new mongoose.Schema({

    Owner:{
        ref:'Users',
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        unique:true
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
              default:Date.now()
            }
        }],
        Videos:[{
            video:{
              type:Buffer,
              required:true
            },
            createdAt:{
                type:Date,
                default:Date.now()
            }
        }],
       
    },
    createdAt:{
        type:Date,
        default:Date.now()
    
    },
    updatedAt:{
        default:Date.now(),
        type:Date
    }
}]
});


projectSchema.statics.CreateProject = async(id,data)=>{

    try{
       const projectFind = await Project.findOne({Owner:id});
       let CreateProject = undefined;
       if(!projectFind){
           CreateProject = new Project({Owner:id})
       }
       else{
           CreateProject = projectFind;
       }
       CreateProject.Projects = await  CreateProject.Projects.concat(data);
       CreateProject.save();
    //    console.log(CreateProject)
       return CreateProject.Projects.filter((objData)=>{
           objData.Project = undefined;
           return objData.Title === data.Title;
       })  
    }
    catch(e){
        console.log(e);
    }


}

projectSchema.statics.updateAlbum = async(files,projectId,userId)=>{

    let project = await Project.findOne({Owner:userId,'Projects._id':projectId},{'Projects.$':1});
    for(var i=0;i<files.length;i++){

        project.Projects[0].Project.Images = await project.Projects[0].Project.Images.concat({image:await sharp(files[i].buffer).png().toBuffer()})
    
    }
    const status = await Project.updateOne({'Projects._id':projectId},{$set:{'Projects.$.Project':project.Projects[0].Project,'Projects.$.updatedAt':Date.now()}});
    
    if(status.nModified ==='0'){
        return null;
    }
    let recentAdded = []
    let reverse = await project.Projects[0].Project.Images.reverse().map((e)=>e);
    for(var i=0;i<files.length;i++){
     
         recentAdded.push({image:await Buffer.from(reverse[i].image).toString('base64'),_id:reverse[i]._id,created:moment(reverse[i].createdAt).fromNow()})

    }
    
    return recentAdded;
}

projectSchema.statics.updateVideos = async(files,projectId,userId)=>{
   

    let project = await Project.findOne({Owner:userId,'Projects._id':projectId},{'Projects.$':1});
    for(var i=0;i<files.length;i++){

        project.Projects[0].Project.Videos = await project.Projects[0].Project.Videos.concat({video:files[i].buffer})
    
    }

    console.log(project.Projects[0].Project);
    const status = await Project.updateOne({'Projects._id':projectId},{$set:{'Projects.$.Project':project.Projects[0].Project,'Projects.$.updatedAt':Date.now()}});
    
    if(status.nModified ==='0'){
        return null;
    }
    let recentAdded = []
    let reverse = await project.Projects[0].Project.Videos.reverse().map((e)=>e);
    for(var i=0;i<files.length;i++){
         
         recentAdded.push({video:await Buffer.from(reverse[i].video).toString('base64'),_id:reverse[i]._id,created:await moment(reverse[i].createdAt).fromNow()})

    }
    
    return recentAdded;
}
const Project = mongoose.model('Projects',projectSchema);
module.exports = Project;