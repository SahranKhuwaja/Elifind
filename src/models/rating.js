const mongoose = require('mongoose');
const validator = require('validator');
const sharp = require('sharp');
const moment = require('moment');
const lodash = require('lodash');

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
        Type:{
            type:String,
            required:true
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
             default:Date.now
           }
       }]
        
    }]
});

ratingSchema.statics.rate = async(Owner,ReferenceID,RatedBy,RatingValue,Type)=>{
   let rate = await Rating.findOne({Owner},{Owner:1});
   if(!rate){
       rate = new Rating({Owner,Ratings:[{ReferenceID,Type,Rating:[{RatedBy,Rating:RatingValue}]}]});
       await rate.save();
       return true;
   }
   rate = await Rating.findOne({Owner,'Ratings.ReferenceID':ReferenceID},{'Ratings.$':1});
   if(!rate){
       await Rating.updateOne({Owner},{$push:{Ratings:{ReferenceID,Type,Rating:{RatedBy,Rating:RatingValue}}}});
       return true;
   }
   rate.Ratings[0].Rating = await rate.Ratings[0].Rating.concat({RatedBy,Rating:RatingValue});
   await Rating.updateOne({Owner,'Ratings.ReferenceID':ReferenceID},{$set:{'Ratings.$.Rating':rate.Ratings[0].Rating}});
   return true;
  

}

ratingSchema.statics.getRatings = async(Owner,ReferenceID)=>{
    let rate = await Rating.findOne({Owner,'Ratings.ReferenceID':ReferenceID},{'Ratings.$':1});
    if(rate){
        let ratings = [];
        let average = 0;
        let rating;
        await rate.Ratings[0].Rating.forEach(e=>{
                 ratings.push(parseFloat(e.Rating));
        });
        average = await (lodash.sum(ratings))/ratings.length;
        rating = await lodash.countBy(await ratings.map(e=>{
           return parseInt(e);
         }));
        for(var i=0;i<Object.keys(rating).length;i++){
            rating[`${i}`] = rating[`${i}`]? ((rating[`${i}`]/ratings.length) * 100).toPrecision(3) + '%' : '';
        }
        return {total:ratings.length,average: average.toFixed(1),rating}
    }
    return {total:0,average:0};

}

const Rating = mongoose.model('Ratings',ratingSchema);
module.exports = Rating;