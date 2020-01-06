const User = require('../models/user');
const bcrypt = require('bcryptjs');
const passChecker = async(req,res,next)=>{

  const check = await User.findById(req.user._id);

  const result = await bcrypt.compare(req.body.currentPassword,check.Password);

  if(!result){
      req.flash('error','Current password is incorrect!');
      return res.redirect('/Profile');
  }
  
  next();


}

module.exports  = passChecker;