const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const moment = require('moment');
const Notification = require('../models/notification');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/Profile/Notifications',auth,async(req,res)=>{
    
    try{
        
        const notifications = await Notification.find({Owner:req.user._id}).sort({createdAt:-1}).limit(parseInt(req.query.limit))
        const data = await Promise.all(notifications.map(async e => {
               return await Notification.getOwnerDetails(e);
          }));
        
        res.send(data);
    }
    catch(e){
        console.log(e)
    }
})

router.get('/Profile/Notifications/Unread',auth,async(req,res)=>{

    try{

        const unread = await (await Notification.find({Owner:req.user._id,Read:false},{Read:1})).length;
        res.send({unread});

    }catch(e){
        console.log(e);
    }
})

router.get('/Profile/Notifications/Read',auth,async(req,res)=>{

    try{

        const status = await Notification.updateMany({Owner:req.user._id,Read:false},{$set:{Read:true}});
        res.send(status);

    }
    catch(e){
        console.log(e);
    }
})





module.exports = router;