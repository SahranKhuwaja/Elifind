const mongoose = require('mongoose');
const moment = require('moment');

const videoSchema = new mongoose.Schema({

    ProjectID:{
        ref:'Projects',
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    VideoID:{
        ref:'Videos.files',
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

videoSchema.statics.upload = async(ProjectID,Files)=>{
    
    let video = undefined;
    const videos = await Promise.all(Files.map(async e=>{
        const video = new Video({ProjectID,VideoID:e.id,FileName:e.filename})
        await video.save();
        return {...video.toObject(),created:await moment(video.createdAt).fromNow()};
    }))
    return videos.reverse();
}

videoSchema.statics.getProjectVideos = async(id)=>{

    try{
        const videos = await Video.find({ProjectID:id});
        return videos;

    }
    catch(e){

    }
}

const Video = new mongoose.model('Videos',videoSchema);

module.exports = Video;