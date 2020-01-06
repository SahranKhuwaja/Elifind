const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
   
   Owner:{
       ref:'Users',
       type:mongoose.Schema.Types.ObjectId,
       required:true
   },

    Token:[{
        token:{
            type:String,
            required:true
        },
        expiresIn:{
            type:Date,
            default:Date.now() + 24 * 60 * 60 * 1000
        }
    }]},
   {
    timestamps:true
})


const token = mongoose.model('Tokens',userSchema);
module.exports = token;