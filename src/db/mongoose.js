const mongoose = require('mongoose');
const client = mongoose.connect(process.env.DB_URl,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology: true,
   
})

module.exports = client;





