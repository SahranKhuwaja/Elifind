const mongoose = require('mongoose');
const client = mongoose.connect(process.env.DB_URL,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology: true,
   
})

module.exports = client;





