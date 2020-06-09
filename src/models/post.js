const mongoose = require('mongoose');
const validator = require('validator');
const sharp = require('sharp');
const moment = require('moment');
const User = require('./user');
const Company = require('./company');
const Project = require('./project');
const Portfolio = require('./portfolio');
const postSchema = new mongoose.Schema({

    Owner:{
        ref:'Users',
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    Posts:[{
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
    }],
    Country:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

postSchema.statics.createPost = async(Owner,Posts,Country)=>{
    try{
     const post = new Post({Owner,Posts,Country}) 
     await post.save();
     return true;
    }catch(e){
        console.log(e);
    }
}

postSchema.statics.getPublicPosts = async(filterLocation,filterSkill)=>{

    let posts = await Post.find({'Posts.Post.Visibility':'Public'});
    posts = await posts.map(e=>{
        return {Owner:e.Owner,Posts:e.Posts.map(e2=>{
            return e2.Post.filter(e3=>{
                return e3.Visibility === 'Public'
            })
        }).filter(check=>{
            return check.length !==0;
        })
    }
    })

    let postsData = [];
    for(var i=0;i<posts.length;i++){
        for(var j=0;j<posts[i].Posts.length;j++){
            for(var k=0;k<posts[i].Posts[j].length;k++){
                posts[i].Posts[j][k] = await Post.getPostsMedia(posts[i].Owner,
                    posts[i].Posts[j][k].ReferenceID,posts[i].Posts[j][k].MediaID,posts[i].Posts[j][k].Type);
            }
            postsData.push({Post:posts[i].Posts[j],...await Post.getUserInfo(posts[i].Owner)})
        }
     }

    return postsData;

}

postSchema.statics.getUserInfo = async(_id)=>{

    let user = await User.findOne({_id},{FirstName:1,LastName:1,Role:1,Dp:1});
    let Dp = await Buffer.from(user.Dp).toString('base64');
    delete user.Dp;
    if(user.Role === 'Company'){
        const company = await Company.findOne({Owner:_id},{CompanyName:1})
        return {...company.toObject(),Dp,Role:user.Role}
    }
    return {...user.toObject(),Dp}
}

postSchema.statics.getPostsMedia = async(Owner,ReferenceID,MediaID,Type)=>{

  let data = {};
  if(Type==='Project/Image'){
    
    data = await Project.findOne({Owner,'Projects._id':ReferenceID},{'Projects.$':1})
    console.log(data.Projects[0].Project)
    data = data.Projects[0].Project.Images.filter(e=>e._id.equals(MediaID))
    return {image:Buffer.from(data[0].image).toString('base64')}
  }
  else if(Type==='Project/Video'){
      console.log('video');
    data = await Project.findOne({Owner,'Projects._id':ReferenceID},{'Projects.$':1})
    data = data.Projects[0].Project.Videos.filter(e=>e._id.equals(MediaID))
    return {video:Buffer.from(data[0].video).toString('base64')}
   
  }
  else if(Type==='Portfolio/Project/Image'){

  }
  else{

  }
  return data;

}


const Post = mongoose.model('Posts',postSchema);
module.exports = Post;