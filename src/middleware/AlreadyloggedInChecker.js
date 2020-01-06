


const AlreadyloggedInChecker = (req,res,next)=>{

try{
    if(req.session.token){
           
           return res.redirect('/Profile/Timeline');
       }
       next();

     
    }catch(e){

        next();

    }


}

module.exports = AlreadyloggedInChecker;