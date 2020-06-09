const mongoose = require('mongoose');

const viewSchema = new mongoose.Schema({
   
   Owner:{
       ref:'Users',
       type:mongoose.Schema.Types.ObjectId,
       required:true
   },
   Visitor:{
       ref:'Users',
       type:mongoose.Schema.Types.ObjectId,
       required:true
   },
   Count:{
      type:Number,
      required:true,
      default: 1

   }

   })

 viewSchema.statics.visit = async(data)=>{
     let view = await View.findOne({Owner:data.Owner,Visitor:data.Visitor});
     if(!view){
         view = new View(data);
     }else{
         view.Count = view.Count + 1;
     }
     await view.save()
     return true;

 }  


const View = mongoose.model('Views',viewSchema);
module.exports = View;