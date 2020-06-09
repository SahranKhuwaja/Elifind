const mongoose = require('mongoose');
const validator = require('validator');
const sharp = require('sharp');
const moment = require('moment');
const projectSchema = new mongoose.Schema({

    Owner:{
        ref:'Users',
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
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
    IsPortfolioProject:{
        type:Boolean,
        required:true,
        default:false
    },
    PortfolioID:{
        type:mongoose.Schema.Types.ObjectId
    },
},{
    timestamps:true
});


projectSchema.statics.createProject = async(id,data)=>{

    try{

    
          const createProject = new Project({Owner:id,...data})
          await createProject.save();
          return createProject
      
    }
    catch(e){
        console.log(e);
    }


}


projectSchema.statics.updateVideos = async(files,projectId,userId)=>{
   

    let project = await Project.findOne({Owner:userId,'Projects._id':projectId},{'Projects.$':1});
    for(var i=0;i<files.length;i++){

        project.Projects[0].Project.Videos = await project.Projects[0].Project.Videos.concat({video:files[i].buffer})
    
    }

    const status = await Project.updateOne({Owner:userId,'Projects._id':projectId},{$set:{'Projects.$.Project':project.Projects[0].Project,'Projects.$.updatedAt':Date.now()}});
    
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