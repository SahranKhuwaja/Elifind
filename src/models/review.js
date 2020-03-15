const mongoose = require('mongoose');
const validator = require('validator');
const sharp = require('sharp');
const moment = require('moment');
const User = require('./user');
const Company = require('./company');
const Rating = require('./rating');

const reviewSchema = new mongoose.Schema({

    Owner:{
        ref:'Users',
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        unique:true
    },
    Reviews:[{
        ReferenceID:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
        },
        Type:{
            type:String,
            required:true
        },
        Review:[{
           ReviewedBy:{
              type:mongoose.Schema.Types.ObjectId,
              required:true,
           },
           Review:{
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

reviewSchema.statics.review = async(Owner,ReferenceID,ReviewedBy,Reviews,Type)=>{
    let review = await Review.findOne({Owner},{Owner:1});
    if(!review){
        review = new Review({Owner,Reviews:[{ReferenceID,Type,Review:[{ReviewedBy,Review:Reviews}]}]});
        await review.save();
        return true;
    }
    review = await Review.findOne({Owner,'Reviews.ReferenceID':ReferenceID},{'Reviews.$':1});
    if(!review){
        await Review.updateOne({Owner},{$push:{Reviews:{ReferenceID,Type,Review:{ReviewedBy,Review:Reviews}}}});
        return true;
    }
    review.Reviews[0].Review = await review.Reviews[0].Review.concat({ReviewedBy,Review:Reviews});
    await Review.updateOne({Owner,'Reviews.ReferenceID':ReferenceID},{$set:{'Reviews.$.Review':review.Reviews[0].Review}});
    return true;
 
 }

 reviewSchema.statics.reviewedBy= async(id,Owner,ReferenceID,MyID)=>{

  const user = await User.findById(id,{FirstName:1,LastName:1,Dp:1,Role:1});
  let Dp = await Buffer.from(user.Dp).toString('base64');
  let userRating = await Rating.findOne({Owner,'Ratings.ReferenceID':ReferenceID},{'Ratings.$':1});
  userRating = userRating.Ratings[0].Rating.filter(e=>e.RatedBy.equals(id));
  if(user.Role === 'Company'){
      const company = await Company.findOne({Owner:id},{CompanyName:1});
      return {...company.toObject(),Dp,_id:id,userRating:userRating[0].Rating,Role:user.Role,reviewed:id.equals(MyID)?true:false}
  }
  delete user.Dp;
  return {...user.toObject(),Dp,userRating:userRating[0].Rating,reviewed:id.equals(MyID)?true:false};

 }

const Review = mongoose.model('Reviews',reviewSchema);
module.exports = Review;