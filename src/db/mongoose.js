const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URl,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology: true,
   
    
})

