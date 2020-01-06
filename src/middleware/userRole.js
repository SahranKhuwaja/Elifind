const role = async(req,res,next)=>{
    if(req.user.Role==='Company'){
        return res.redirect('/Profile/Timeline');
    } 
    next();
}

module.exports = role;