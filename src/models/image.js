const mongoose = require('mongoose');
const imagesSchema = new mongoose.Schema({

    ProjectID:{
        ref:'Projects',
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    ImageID:{
        ref:'Images.files',
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    FileName:{
        type:String,
        required:true
        
    },
    Type:{
       type:String,
       required:true,
       default:'Project'
 
    }
},{
    timestamps:true
})

imagesSchema.statics.upload = async(ProjectID,Files)=>{
    
    let image = undefined;
    const images = await Promise.all(Files.map(async e=>{
        const image = new Image({ProjectID,ImageID:e.id,FileName:e.filename})
        await image.save();
        return image;
    }))
    return images.reverse();
}

imagesSchema.statics.getProjectImages = async(id)=>{

    try{
        const images = await Image.find({ProjectID:id});
        return images;

    }
    catch(e){

    }
}

const Image = new mongoose.model('Images',imagesSchema);

module.exports = Image;