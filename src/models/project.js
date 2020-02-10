const mongoose = require('mongoose');
const validator = require('validator');

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
       console.log(CreateProject)
       return CreateProject.Projects.filter((objData)=>{
           objData.Project = undefined;
           return objData.Title === data.Title;
       })  
    }
    catch(e){
        console.log(e);
    }


}

const Project = mongoose.model('Projects',projectSchema);
module.exports = Project;