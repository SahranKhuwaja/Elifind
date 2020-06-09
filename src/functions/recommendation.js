const User = require('../models/user');
const Company = require('../models/company');
const View = require('../models/views');
const { forOwn } = require('lodash');
let usersData = [];
let viewsData = {};
let viewsStats;
let similaryScoresList = {}
const K = 10;

exports.getUsers = async () => {

    return await User.find({}, { _id: 1 })
}


exports.getViews = async () => {
    viewsStats = await View.find()
    return viewsStats;
}

exports.KNN = async (Users, Views, ID) => {
    let views = {};
    
    for (var i = 0; i < Views.length; i++) {

        if (Object.values(views).length === 0) {
            views[Views[i].Visitor] = { [Views[i].Owner]: Views[i].Count }
        }
        else {
            let keys = Object.keys(views);
            for (var j = 0; j < keys.length; j++) {
                views[Views[i].Visitor] = views[Views[i].Visitor] !== undefined ?
                    { ...views[Views[i].Visitor], [Views[i].Owner]: Views[i].Count } : { [Views[i].Owner]: Views[i].Count }
            }
        }

    }

    usersData = Users;
    viewsData = views;
    const neighbours = await nearestNeighbour(ID);
    return await neighbours;

}

const nearestNeighbour = async (ID) => {

    let SimilartyScores = {};
    let SimilartyScoresFinal = {}

    for (let i = 0; i < usersData.length; i++) {
        if (ID.toString() !== usersData[i]._id.toString()) {
            let similarty = await euclideanDistance(ID, usersData[i]._id)
            SimilartyScores[usersData[i]._id] = similarty;
        } else {
            SimilartyScores[usersData[i]._id] = -1;
        }
    }


    for (var i = 0; i < Object.entries(SimilartyScores).length; i++) {
        if (SimilartyScores[usersData[i]._id] !== undefined) {
            SimilartyScoresFinal[usersData[i]._id] = await SimilartyScores[usersData[i]._id]
        }
    }

    similaryScoresList = await SimilartyScoresFinal;
    let users = Object.keys(SimilartyScoresFinal)
    users.sort((a, b) => {
        var score1 = SimilartyScoresFinal[a]
        var score2 = SimilartyScoresFinal[b]
        return score2 - score1
    })
    let = KNN = []
    for (var i = 0; i < K; i++) {
        if (i < users.length) {
            if (users[i].toString() !== ID.toString()) {
                KNN.push(users[i])
            }

        }

    }

    return KNN;


}


const euclideanDistance = async (MyID, UserID) => {
    let views1 = viewsData[MyID];
    let views2 = viewsData[UserID];

    if (views1 !== undefined && views2 !== undefined) {
        let sumSquares = null;
        let distance;
        let similarity;
        for (var i = 0; i < usersData.length; i++) {
            skip = false;
            let view1 = views1[usersData[i]._id]
            let view2 = views2[usersData[i]._id]
           

            if (view1 !== undefined && view2 !== undefined) {
                
                let diff = view2 - view1;
                sumSquares += diff * diff;
               
            }
        }
        if (sumSquares !== null) {
            distance = Math.sqrt(sumSquares);
            similarity = 1 / (1 + distance);
        }

        return similarity;

    }

}

exports.predictions = async (neighbours, ID) => {

    const user = Object.keys(viewsData[ID])

    let visitPredictions = {};


    for (var i = 0; i < usersData.length; i++) {
        let weightedSum = 0;
        let similaritySum = 0;
        if (ID.toString() !== usersData[i]._id.toString()) {

            if (!user.includes(usersData[i]._id.toString())) {
                if (!neighbours.includes(usersData[i]._id.toString())) {

                    for (var j = 0; j < K; j++) {
                        if (j < neighbours.length) {

                            let similarity = similaryScoresList[neighbours[j]];
                            let visits = viewsData[neighbours[j]];
                            let visit = visits[usersData[i]._id];
                            if (visit !== undefined) {

                                weightedSum += visit * similarity;
                                similaritySum += similarity;

                            }

                        }

                    }
                    if (weightedSum !== 0) {
                        const prediction = weightedSum / similaritySum;
                        visitPredictions[usersData[i]._id] = prediction;
                    }

                }
            }

        }

    }

    let predictionsFinal = Object.keys(visitPredictions)
    predictionsFinal.sort((a, b) => {
        let prediction1 = visitPredictions[a];
        let prediction2 = visitPredictions[b];
        return prediction2 - prediction1
    })
    let predictionsK = []
    for (var i = 0; i < K; i++) {

        if (predictionsFinal[i] !== undefined) {
            predictionsK.push(predictionsFinal[i])
        }

    }
    return predictionsK;

}

exports.getUserInfoForNeighbours = async (Neighbours) => {

    try {

        const data = await Promise.all(Neighbours.map(async e => {
            return await fetchInfo(e)
        }))
        return data

    } catch (e) {
        console.log(e)
    }

}

exports.getUserInfoForPredictions = async (Predictions) => {


    try {
        const data = await Promise.all(Predictions.map(async e => {
            return await fetchInfo(e)
        }))

        return data;

    } catch (e) {
        console.log(e)
    }


}

const fetchInfo = async (_id) => {
    try {

        let user = await User.findById(_id, { FirstName: 1, LastName: 1, Dp: 1, Role: 1, Email: 1, Country: 1, City: 1, Phone: 1 });
        let Dp = undefined;
        if (user.Dp) {
            Dp = await Buffer.from(user.Dp).toString('base64');
            delete user.Dp;
        }
        if (user.Role === 'Company') {
            let company = await Company.findOne({ Owner: user._id }, { CompanyName: 1 })
            delete company._id;
            return { ...company.toObject(), Dp, ...user.toObject(), FirstName: undefined, LastName: undefined }
        }

        return { ...user.toObject(), Dp }


    } catch (e) {
        console.log(e)
    }
}

exports.getViewsData = async (id) => {

    let data = [];

    await usersData.forEach(e => {
        viewsStats.forEach(el => {
            if (e._id.toString() !== id.toString()) {
                if (e._id.toString() === el.Owner.toString()) {
                    if (data[e._id] === undefined) {
                        data[e._id] = el.Count
                    } else {
                        data[e._id] += el.Count
                    }
                }
            }
        })
    })
    let userProfiles = await Object.keys(data)
    await userProfiles.sort((a,b)=>{
        let view1 = data[a];
        let view2 = data[b];
        return view2 - view1 
    })
    userProfiles = await userProfiles.slice(0,5);
    let users = [];
    userProfiles.forEach((e,i)=>{
        users.push({user:e,views:data[e]})
    })
    
    return await users;
}

exports.getDataOfMostViewedProfile = async(data)=>{

    try{
        const user = await Promise.all(data.map(async e=>{
       
            return await fetchInfoOfMostViewedProfile(e)
        }))

        return user

    }catch(e){
        console.log(e)
    }

}

const fetchInfoOfMostViewedProfile = async(data)=>{

    try{

        let user = await User.findById(data.user, { FirstName: 1, LastName: 1, Dp: 1, Role: 1 });
        let Dp = undefined;
        if (user.Dp) {
            Dp = await Buffer.from(user.Dp).toString('base64');
            delete user.Dp;
        }
        if (user.Role === 'Company') {
            let company = await Company.findOne({ Owner: data.user }, { CompanyName: 1})
            delete company._id;
            return { ...company.toObject(), Dp,...user.toObject(), views:data.views,FirstName:undefined,LastName:undefined}
        }

        return { ...user.toObject(), Dp, views:data.views }


    }catch(e){
        console.log(e)
    }

}




