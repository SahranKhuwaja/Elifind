const mongoose = require('mongoose');
const User = require('./user');
const moment = require('moment');
const path = require('path');
const check = require('check-types');
const sharp = require('sharp');
const Company = require('../models/company');
const chatSchema = new mongoose.Schema({
    
    UserOne:{
        ref:'Users',
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        

    },
    UserTwo:{
        ref:'Users',
        type:mongoose.Schema.Types.ObjectId,
        required:true,
       
    },
    Messages:[{
        MessageFrom:{
            ref:'Users',
            type:mongoose.Schema.Types.ObjectId,
            required:true,
           
    
        },
        MessageTo:{
            ref:'Users',
            type:mongoose.Schema.Types.ObjectId,
            required:true,
           
        },
        Message:{
            type:String
        },
        Attachment:{
            type:Buffer

        },
        Date:{
            type:Date,
            required:true,
            default:Date.now
        },
        Type:{
            type:Object,
            
        }
      }]

});

chatSchema.statics.getUserInfo = async(to)=>{

  const user = await User.findById(to,{FirstName:1,LastName:1,Dp:1,Role:1});
  let userData = undefined;
  if(user.Role === 'Company'){
    const company = await Company.findOne({Owner:user._id},{CompanyName:1});
    userData = await {CompanyName:company.CompanyName}
  }else{
    userData = await {FirstName:user.FirstName,LastName:user.LastName};
  }
  if(user.Dp){

    userData.dp = await Buffer.from(user.Dp).toString('base64');

  }
   return userData;
}

chatSchema.statics.storeMessages = async (userOne,userTwo,message,type)=>{

    let chat = null;
    const chatM = await Chat.findOne({$or:[{UserOne:userOne,UserTwo:userTwo},{UserOne:userTwo,UserTwo:userOne}]});
     
    if(!chatM){

       if(check.string(message)){
        chat = new Chat({UserOne:userOne,UserTwo:userTwo,Messages:[{MessageFrom:userOne,MessageTo:userTwo,Message:message}]});
       }else{
        chat = new Chat({UserOne:userOne,UserTwo:userTwo,Messages:[{MessageFrom:userOne,MessageTo:userTwo,Attachment:message,Type:type}]});
       }

       
    }else{
       chat = chatM
       if(check.string(message)){
       chat.Messages = chat.Messages.concat({MessageFrom:userOne,MessageTo:userTwo,Message:message});
       }else{
        chat.Messages = chat.Messages.concat({MessageFrom:userOne,MessageTo:userTwo,Attachment:message,Type:type});
       }
    }

    await chat.save();

}

chatSchema.statics.messages = async (Message,from,to)=>{
    const u = await User.findById(from,{FirstName:1,LastName:1,Dp:1,Role:1});
    var user = await {Message,from,to,time: moment(new Date().getTime()).format('LT')};

    if(u.Role==='Company'){
        const company = await Company.findOne({Owner:u._id},{CompanyName:1});
        user.CompanyName = await company.CompanyName;
       

    }else{

        user.FirstName = await u.FirstName;
        user.LastName  = await u.LastName;

    }


   
    if(u.Dp){

        user.dp = await Buffer.from(u.Dp).toString('base64');
         
    }
    
    
    return user;
      
        

    
}

chatSchema.statics.getMessages = async (userOne,userTwo)=>{

 
    const messages = await Chat.findOne({$or:[{UserOne:userOne,UserTwo:userTwo},{UserOne:userTwo,UserTwo:userOne}]},{Messages:1});

    if(!messages){
        return null;
    }

    const userOneData = await User.findById(userOne,{FirstName:1,LastName:1,Dp:1,Role:1});
    const userTwoData = await User.findById(userTwo,{FirstName:1,LastName:1,Dp:1,Role:1});
    var messagesData = await {...messages.toObject()}

    if(userOneData.Role==='Company'){

        const company = await Company.findOne({Owner:userOneData._id},{CompanyName:1})
        messagesData.user1 = await company.toObject();

    }else{

        messagesData.user1 = await userOneData.toObject();
    }

    if(userTwoData.Role==='Company'){

        const company = await Company.findOne({Owner:userTwoData._id},{CompanyName:1})
        messagesData.user2 = await company.toObject();

    }else{
        messagesData.user2 = await userTwoData.toObject();
    }
   
   
    if(userOneData.Dp){

       messagesData.user1.dp = await  Buffer.from(userOneData.Dp).toString('base64');
    }
    
    if(userTwoData.Dp){
       
        messagesData.user2.dp = await  Buffer.from(userTwoData.Dp).toString('base64');
    }

    await messagesData.Messages.filter(async(user)=>{
        
            if(user.MessageFrom.toString() === userOne){
               
                user.u1 = await true;
                user.time = await moment(user.Date.getTime()).format('LT');
                user.date = await moment(user.Date).format('MMMM DD, YYYY');
               
                
            }
            if(user.MessageFrom.toString() === userTwo){
                
                user.u2 = await true;
                user.time = await moment(user.Date.getTime()).format('LT');
                user.date = await moment(user.Date).format('MMMM DD, YYYY');
                
                
            }
           
            
    });
    
    return messagesData;




}



chatSchema.statics.attachment = async (file,from) =>{

    
     let Type = {};

     
     if(path.basename(file.name).toLowerCase().match(/\.(jpg||jpeg||png)$/)){
       
        Type.image = await true;

     }else if(path.basename(file.name).toLowerCase().match(/\.(pdf)$/)){

        Type.pdf = await true;
     }
     else if(path.basename(file.name).toLowerCase().match(/\.(txt)$/)){

        Type.txt = await true;

     }else{
        
        return {error:"Please upload the relevant docuement!"};
      

    }
     const u = await User.findById(from,{FirstName:1,LastName:1,Dp:1});
     let dp = undefined;

     if(u.Dp){
         dp = await Buffer.from(u.Dp).toString('base64');
     }
     
     
     return {Attachment:Buffer.from(file.file).toString('base64'),FirstName:u.FirstName,LastName:u.LastName,dp,from,to:file.to,Type,time:moment(new Date().getTime()).format('LT')};


       
        
    


}





const Chat = mongoose.model('Chats',chatSchema);
module.exports = Chat;
