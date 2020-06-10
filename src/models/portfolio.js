const mongoose = require('mongoose');
const portfolioSchema = new mongoose.Schema({

    Owner:{
        ref:'Users',
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    Title:{
        type:String,
        required:true,
    },
    Type:{
        type:String,
        required:true
    },
    Category:{
        type:String,
        required:true
    },
    Description:{
        type:String,
        required:true
    }
},{
    timestamps:true
});


portfolioSchema.statics.createPortfolio = async(Owner,data)=>{

    try{
        const createPortfolio = new Portfolio({Owner,...data})
        await createPortfolio.save();
        return createPortfolio;
    }
    catch(e){
        console.log(e);
    }
}

const Portfolio = mongoose.model('Portfolios',portfolioSchema);
module.exports = Portfolio;