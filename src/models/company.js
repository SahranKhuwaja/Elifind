const mongoose = require('mongoose');
const check = require('check-types');
const companySchema = new mongoose.Schema({
    Owner:{
        ref:'Users',
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        unique:true
    },
    CompanyName:{
        type:String,
        required:true
    },
    FoundedOn:{
        type:Date,
        required:true
    },
    Category:{
        type:String,
        required:true,
        
    },
    Contact:{
        type:Number,
        required:true
    },
    Details:{
        type:String,
        required:true
    },
    Address:{
        type:String,
        required:true
    },
    Specialization:[{
        SpecializedIn:{
            type:String,
            required:true
        }
    }]
},{
    timestamps:true
});

companySchema.statics.CompanyDetails = async (data,id)=>{

    try{
    const company = new Company({Owner:id,CompanyName:data.CompanyName,FoundedOn:data.FoundedOn,Contact:data.Contact,Address:data.Address,Details:data.Details});
  
    if(check.array(data.Category)){

    var cat = await data.Category.filter((c)=>{
        return c !="";
    })
    company.Category = await cat[0];

    }else{
     
    company.Category = await data.Category;

    }
    
    if(check.array(data.Specialization)){
     
        data.Specialization.filter((spec)=>{
     
        company.Specialization = company.Specialization.concat({SpecializedIn:spec});  

        });

    }else{

        company.Specialization = await company.Specialization.concat({SpecializedIn:data.Specialization});;

    }

    await company.save();
    return true;

   }catch(e){
      
    console.log(e);
    return false;

   }





}


const Company = mongoose.model('Company',companySchema);

module.exports = Company;

