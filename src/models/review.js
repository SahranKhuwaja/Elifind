const mongoose = require('mongoose');
const validator = require('validator');
const sharp = require('sharp');
const moment = require('moment');

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
        Reviews:[{
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

const Review = mongoose.model('Reviews',reviewSchema);
module.exports = Review;