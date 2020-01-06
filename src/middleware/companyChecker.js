const User = require('../models/user');
const Company = require('../models/company');


const companyChecker = async (req,res,next)=>{

 

    await req.user.populate('company').execPopulate();

    if(req.user.company[0]){

        return res.redirect('/Profile/Timeline');

    }

    next();

}


module.exports = companyChecker;