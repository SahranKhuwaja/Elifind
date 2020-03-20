const mongoose = require('mongoose');
const validator = require('validator');
const sharp = require('sharp');
const moment = require('moment');
const User = require('./user');
const Company = require('./company');
const notificationSchema = new mongoose.Schema({

    Owner:{
        ref:'Users',
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    NotifiedBy:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    Notification:{
        type:String,
        required:true
    },
    NotificationAbout:{
        type:String,
        required:true
    },
    MediaName:{
        type:String,
    }    
},{
    timestamps:true
});

notificationSchema.statics.createNotification = async(Owner,NotifiedBy,NotificationText,NotificationAbout,MediaName)=>{

    try{
        const notification = new Notification({Owner,NotifiedBy,Notification:NotificationText,NotificationAbout,MediaName});
        await notification.save();
        return notification;

    }catch(e){
        console.log(e);
    }
}

notificationSchema.statics.getOwnerDetails = async(data)=>{

    try{
     
       const user = await User.findById(data.NotifiedBy,{FirstName:1,LastName:1,Dp:1,Role:1});
       let Dp = undefined
       if(user.Dp){
         Dp = await Buffer.from(user.Dp).toString('base64');
         delete user.Dp;
       }
       if(user.Role === 'Company'){
           let company = await Company.findOne({Owner:user._id},{CompanyName:1,Owner:1})
           return {...company.toObject(),Dp,...data.toObject()}
       }
       return {...user.toObject(),Dp,...data.toObject()}
    }
    catch(e){
        console.log(e);
    }
}

const Notification = mongoose.model('Notifications',notificationSchema);
module.exports = Notification;