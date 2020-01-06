const mongoose = require('mongoose');

const hireSchema = new mongoose.Schema({
    HiredBy:{
        ref:'Users',
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    User:{
        ref:'Users',
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        unique:true
    }
},{
    timestamps:true
});



const Hire = mongoose.model('Hire',hireSchema);

module.exports = Hire;

