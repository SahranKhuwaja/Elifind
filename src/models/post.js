const mongoose = require('mongoose');
const validator = require('validator');
const sharp = require('sharp');
const moment = require('moment');
const User = require('./user');
const Company = require('./company');
const Project = require('./project');
const Portfolio = require('./portfolio');
const Image = require('./image');
const Video = require('./video');




const postSchema = new mongoose.Schema({

    Owner: {
        ref: 'Users',
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    Posts: [{
        ReferenceID: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        MediaID: {
            type: mongoose.Schema.Types.ObjectId,
        },

    }],
    Type: {
        type: String,
        required: true
    },
    About:{
        type:String
    },
    Country: {
        type: String,
    },
    Visibility: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

postSchema.statics.createPost = async (Owner, Posts, Type, About ,Country, Visibility) => {
    try {
        const post = new Post({ Owner, Posts, Type, About, Country, Visibility })
        await post.save();
        return post;
    } catch (e) {
        console.log(e);
    }
}

postSchema.statics.getPublicPosts = async (location, skills) => {

    try {
        
        const posts = await Post.find({ Visibility: 'Public', ...location!==undefined?{Country:location}:null,
        ...skills!==undefined?{About:{'$in':skills}}:null});
        let postsWithUserInfo = await Promise.all(posts.reverse().map(async e => {
            const type = e.Type.toLowerCase().split('/');
            return {
                ...await Post.getProjectDetails(e.Posts[0].ReferenceID),
                ...await Post.getUserInfo(e.Owner),
                Media: await Promise.all(e.Posts.map(async el => {
                    return await Post.getPostsMedia(el.ReferenceID, el.MediaID, e.Type)
                })),
                Type: type[2] !== undefined ? type[2].slice(0, -1) : type[1].slice(0, -1),
                Country:e.Country,
                About:e.About,
                Length: e.Posts.length,
                CreatedAt: await moment(e.createdAt).fromNow()
            }


        }));

        return await postsWithUserInfo

    } catch (e) {
        console.log(e)
    }




}

postSchema.statics.getUserInfo = async (_id) => {

    let user = await User.findOne({ _id }, { FirstName: 1, LastName: 1, Role: 1, Dp: 1 });
    let Dp = await Buffer.from(user.Dp).toString('base64');
    delete user.Dp;
    if (user.Role === 'Company') {
        const company = await Company.findOne({ Owner: _id }, { CompanyName: 1 })
        return { ...company.toObject(), Dp, Role: user.Role, _id }
    }
    return { ...user.toObject(), Dp }
}

postSchema.statics.getProjectDetails = async (ReferenceID) => {

    const projectInfo = await Project.getTitle(ReferenceID);;
    let portfolioData = undefined;
    if (projectInfo.PortfolioID !== undefined) {
        portfolioData = await Portfolio.getTitle(projectInfo.PortfolioID);
    }
    return {
        ...projectInfo.toObject(), PortfolioTitle: portfolioData !== undefined ? portfolioData.Title : null
    }
}

postSchema.statics.getPostsMedia = async (ReferenceID, MediaID, Type) => {

    let data = undefined;
    if (Type === 'Project/Images' || Type === 'Portfolio/Project/Images') {
        data = await Image.getImage(MediaID, ReferenceID);
    } else {
        data = await Video.getVideo(MediaID, ReferenceID)
    }


    return await { MediaID: data.ImageID !== undefined ? data.ImageID : data.VideoID, FileName: data.FileName }


}

const Post = mongoose.model('Posts', postSchema);
module.exports = Post;