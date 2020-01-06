const role = async(req,res,next)=>{
    if(req.user.Role!=="Company"){

        return res.redirect('/Profile/Timeline');

    }
    await req.user.populate('company').execPopulate();
    next();
}

module.exports = role;