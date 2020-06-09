const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const mongoose = require('mongoose');
const Video = require('../models/video');
const moment = require('moment');

let gfs;
mongoose.connection.once('open',()=>{
    gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db,{
      bucketName:'Videos'
    });
})

router.get('/Project/Videos/Get',auth,async(req,res)=>{
    let videos = await Video.getProjectVideos(req.query.id);
    res.send(videos.reverse())
})

router.get('/Video/:id/:filename',auth,async(req,res)=>{
    const video = await gfs.find({_id:new mongoose.Types.ObjectId(req.params.id),filename:req.params.filename})
    await video.toArray((err,file)=>{
        if(err || file.length === 0){
            return res.send(null)
        }
        gfs.openDownloadStreamByName(file[0].filename).pipe(res)
    })
})

module.exports = router;