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


projectSchema.statics.createProject = async(Owner,data)=>{

    try{
      
          const createProject = new Project({Owner,...data})
          await createProject.save();
          return createProject
      
    }
    catch(e){
        console.log(e);
    }


}

projectSchema.statics.getTitle = async(_id)=>{
    
    try{
        const project = await Project.findById(_id,{Title:1,PortfolioID:1});
        return project;

    }catch(e){
        console.log(e)
    }
}

const Project = mongoose.model('Projects',projectSchema);
module.exports = Project;