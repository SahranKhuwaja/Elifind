const mongoose = require('mongoose');
const validator = require('validator');
const User = require('./user');
const check = require('check-types');

const inomashSchema = new mongoose.Schema({


    Owner:{
    
        ref:'Users',
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        unique:true

    },

  Courses:[{

    CourseTitle:{
        type:String,
        required:true,

    },
    Institute:{
        type:String,
        required:true,
    
    },
    StartYear:{
        type:Date,
        required:true
    },
    EndYear:{
        type:Date,
        required:true
    }

  }
],

Skills:[{

    Skill:{
        type:String,
        required:true,
    },
    Category:{
        type:String,
        required:true
    },
    GoldenSkill:{
        type:Boolean,
        required:true
    },
    SkillRate:{
        type:Number,
        required:true

    }
}],

WorkExperience:[{

   ExperienceIn:{
       type:String,
       required:true
   },
   WorkPlace:{
    type:String,
    required:true
    },
    StartYear:{
        type:Date,
        required:true
    },
    EndYear:{
        type:Date,
        required:true
    }

}]



},{timestamps:true});



inomashSchema.statics.INOMASH = async (obj,id) => {


const user = await User.findOne({_id:id});

 if(obj.Phone){
    user.Phone = obj.Phone;
 }
else{
    user.Phone = undefined;
}

if(obj.State){
    user.State = obj.State;
    
}else{
    user.State = undefined;
}

await user.save();



const inomash = new Inomash();

inomash.Owner = id;

if(obj.CourseTitle){

if(check.array(obj.CourseTitle)){

    for(var i = 0;i<obj.CourseTitle.length;i++){

       inomash.Courses = inomash.Courses.concat({CourseTitle:obj.CourseTitle[i],Institute:obj.Institute[i],StartYear:obj.StartYear[i],EndYear:obj.EndYear[i]});

    }
}else{

    inomash.Courses = inomash.Courses.concat({CourseTitle:obj.CourseTitle,Institute:obj.Institute,StartYear:obj.StartYear,EndYear:obj.EndYear});


}
}


if(check.array(obj.Skill)){


    obj.Category = obj.Category.filter((e)=>{

        return e!="";

    })

    for(var i = 0;i<obj.Skill.length;i++){
       
        inomash.Skills = inomash.Skills.concat({Skill:obj.Skill[i],Category:obj.Category[i],GoldenSkill:obj.GoldenSkill[i],SkillRate:obj.SkillRate[i]});

    }

}else{

    var category = [obj.Category];
    if(check.array(obj.Category)){
        category = obj.Category.filter((e)=>{
            return e != "";
        })
    }
    inomash.Skills = inomash.Skills.concat({Skill:obj.Skill,Category:category[0],GoldenSkill:obj.GoldenSkill,SkillRate:obj.SkillRate}
        );
}

if(obj.ExperienceIn){
if(check.array(obj.ExperienceIn)){

    

   for(var i=0;i<obj.ExperienceIn.length;i++){

  
    inomash.WorkExperience = inomash.WorkExperience.concat({ExperienceIn:obj.ExperienceIn[i],WorkPlace:obj.WorkPlace[i],StartYear:obj.EStartYear[i],EndYear:obj.EEndYear[i]}); 


   }



}else{

    
    inomash.WorkExperience = inomash.WorkExperience.concat({ExperienceIn:obj.ExperienceIn,WorkPlace:obj.WorkPlace,StartYear:obj.EStartYear,EndYear:obj.EEndYear});


}
}

inomash.save();

return true;

}


const Inomash = mongoose.model('InoMash',inomashSchema);

module.exports = Inomash;



