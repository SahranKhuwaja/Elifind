const mongoose = require('mongoose');
const validator = require('validator');
const sharp = require('sharp');
const moment = require('moment');

const postSchema = new mongoose.Schema({

    Owner:{
        ref:'Users',
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        unique:true
    },
    Posts:[{
        Post:[{
            Type:{
                type:String,
                required:true
            },
            ReferenceID:{
                type: mongoose.Schema.Types.ObjectId,
                required:true
            },
            MediaID:{
                type: mongoose.Schema.Types.ObjectId,
            },
            Visibility:{
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

postSchema.statics.createPost = async(id,data)=>{
    try{
     let post= await Post.findOne({Owner:id});
     if(!post){
         post = new Post({Owner:id})
     }
     post.Posts = await post.Posts.concat({Post:data});
     await post.save();
     return true;
    }catch(e){
        console.log(e);
    }
}


const Post = mongoose.model('Posts',postSchema);
module.exports = Post;