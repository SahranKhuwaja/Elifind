const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const mongoose = require('mongoose');
const Image = require('../models/image');

let gfs;
mongoose.connection.once('open',()=>{
    gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db,{
      bucketName:'Images'
    });
})

router.get('/Project/Images/Get',auth,async(req,res)=>{
    const images = await Image.getProjectImages(req.query.id);
    res.send(images.reverse())
})

router.get('/Image/:id/:filename',auth,async(req,res)=>{
    const image = await gfs.find({_id:new mongoose.Types.ObjectId(req.params.id),filename:req.params.filename})
    await image.toArray((err,file)=>{
        if(err || file.length === 0){
            return res.send(null)
        }
        gfs.openDownloadStreamByName(file[0].filename).pipe(res)
    })
})

module.exports = router;