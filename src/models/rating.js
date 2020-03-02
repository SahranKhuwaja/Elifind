const mongoose = require('mongoose');
const validator = require('validator');
const sharp = require('sharp');
const moment = require('moment');

const ratingSchema = new mongoose.Schema({

    Owner:{
        ref:'Users',
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        unique:true
    },
    Ratings:[{
        ReferenceID:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
        },
        Rating:[{
           RatedBy:{
              type:mongoose.Schema.Types.ObjectId,
              required:true,
           },
           Rating:{
              type:String,
              required:true
           },
           createdAt:{
             type:Date,
             default:Date.now()
           }
       }]
        
    }]
});

ratingSchema.statics.rate = async(Owner,ReferenceID,RatedBy,RatingValue)=>{

   let rate = await Rating.findOne({Owner},{Owner:1});
   if(!rate){
       rate = new Rating({Owner,Ratings:[{ReferenceID,Rating:[{RatedBy,Rating:RatingValue}]}]});
       await rate.save();
       return true;
   }
   rate = await Rating.findOne({Owner,'Ratings.ReferenceID':ReferenceID},{'Ratings.$':1});
   if(!rate){
       await Rating.updateOne({Owner},{$push:{Ratings:{ReferenceID,Rating:{RatedBy,Rating:RatingValue}}}});
       return true;
   }
   rate.Ratings[0].Rating = await rate.Ratings[0].Rating.concat({RatedBy,Rating:RatingValue});
   await Rating.updateOne({Owner,'Ratings.ReferenceID':ReferenceID},{$set:{'Ratings.$.Rating':rate.Ratings[0].Rating}});
   return true;
  

}

const Rating = mongoose.model('Ratings',ratingSchema);
module.exports = Rating;