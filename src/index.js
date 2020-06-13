const express = require('express');
const path = require('path');
const hbs = require('hbs');
const data = require('./countries/country');
const helpers = require('handlebars-helpers');
const userRouter = require('./routes/user');
const inomashRouter = require('./routes/inomash');
const searchRouter = require('./routes/search');
const companyRouter = require('./routes/company');
const hireRouter = require('./routes/hire');
const projectRouter = require('./routes/projects');
const portfolioRouter = require('./routes/portfolio');
const imageRouter = require('./routes/image');
const videoRouter = require('./routes/video');
const ratingRouter = require('./routes/rating');
const reviewRouter = require('./routes/review');
const newsfeedRouter = require('./routes/newsfeed');
const notificationRouter = require('./routes/notification');
const textminerRouter = require('./routes/textminer');
const recommendationRouter = require('./routes/recommendation');
const viewRouter = require('./routes/view');
const flash = require('connect-flash');
const http = require('http');
const socketio = require('socket.io');
const Chat = require('./models/chat');
const Filter = require('bad-words');
const Hire = require('./models/hire');
const Notification = require('./models/notification');
const Post = require('./models/post');
const moment = require('moment')
require('./db/mongoose');


const array = helpers.array();

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT;

app.use(express.json());
app.use(express.static(path.join(__dirname,'../public')));
app.set('view engine','hbs');
app.set('views',path.join(__dirname,'../templates/views'));
hbs.registerPartials(path.join(__dirname,'../templates/partials'));
app.use(flash())
app.use(userRouter);
app.use(inomashRouter);
app.use(searchRouter);
app.use(companyRouter);
app.use(hireRouter);
app.use(projectRouter);
app.use(portfolioRouter);
app.use(imageRouter);
app.use(videoRouter);
app.use(ratingRouter);
app.use(reviewRouter);
app.use(newsfeedRouter);
app.use(notificationRouter);
app.use(textminerRouter);
app.use(recommendationRouter);
app.use(viewRouter)
app.use(express.json());
let users = {};
let clients = 0;


io.on('connection',(socket)=>{
socket.on('currentUser',(id)=>{
socket.userID = id;
users[socket.userID] = socket;
});


console.log('new connection');
socket.on('getUserInfo',async(to)=>{
    socket.emit('userInfo',await Chat.getUserInfo(to));
})

socket.on('getAllMessages',async(to)=>{
    socket.emit('displayAllMessages',await Chat.getMessages(socket.userID,to));
})


socket.on('message',async (mData)=>{

  const filter = new Filter({list: ['bc', 'mc', 'chutiya']});
  if(filter.isProfane(mData.message)){
      return socket.emit('warning',{from:socket.userID,to:mData.to,message:'Use of inappropriate words is strictly prohibitted!'});
  }
await Chat.storeMessages(socket.userID,mData.to,mData.message);
const message = await Chat.messages(mData.message,socket.userID,mData.to)

if(!users[mData.to]){
    return io.to(users[socket.userID].id).emit('displayMessage',message);
}

io.to(users[mData.to].id).emit('displayMessage',message);
io.to(users[socket.userID].id).emit('displayMessage',message);

})

socket.on('open',(to,from)=>{
    if(users[to]){
    io.to(users[to].id).emit('openChat',{to,from});
    }
})

socket.on('attachment',async(file)=>{

    const attachment = await Chat.attachment(file,socket.userID);

    if(attachment.error){
        
        return io.to(users[socket.userID].id).emit('warning',{from:socket.userID,to:file.to,message:attachment});
    }
    await Chat.storeMessages(socket.userID,file.to,Buffer.from(file.file),attachment.Type);
    if(!users[file.to]){
        return io.to(users[socket.userID].id).emit('displayMessage',attachment);
    }
    io.to(users[file.to].id).emit('displayMessage',attachment);
    io.to(users[socket.userID].id).emit('displayMessage',attachment);
  
    

});

socket.on('checkOnline',(to)=>{
     let online = false;
    if(users[to]){
       online = true; 
    }
    socket.emit('status',{online,to,from:users[socket.userID].userID});

});

socket.on('callingToClient',(to)=>{
    
    io.to(users[to].id).emit('showCalling',{to,from:users[socket.userID].userID});
})

socket.on('connectCall',(data)=>{
    io.to(users[data.to].id).emit('buildConnection',data);
    io.to(users[data.from].id).emit('buildConnection',data);
})

socket.on('end',(to)=>{
    io.to(users[to].id).emit('cancelCall');
    io.to(users[socket.userID].id).emit('cancelCall');
})

socket.on('endCall',(data)=>{
    io.to(users[data.to].id).emit('cancelCall');
    io.to(users[data.from].id).emit('cancelCall');
})


socket.on("call", function () {

    this.emit('CreatePeer')
        
    
})
socket.on('Offer', SendOffer)
socket.on('Answer', SendAnswer)
socket.on('disconnect', Disconnect)

socket.on('notification',async(data)=>{
    
    const notification = await Notification.createNotification(data.userID,data.myID,data.notificationText,data.notificationAbout,
        data.mediaName,data.welcome);
    const nData = await Notification.getOwnerDetails(notification);
    if(users[data.userID]){
        io.to(users[data.userID].id).emit('notify',nData);
    }
})

socket.on('realTimePost',async(posts)=>{
   
   let postsWithUserInfo = await Promise.all([posts].reverse().map(async e => {
    const type = e.Type.toLowerCase().split('/');
    return {
        ...await Post.getProjectDetails(e.Posts[0].ReferenceID),
        ...await Post.getUserInfo(e.Owner),
        Media: await Promise.all(e.Posts.map(async el => {
            return await Post.getPostsMedia(el.ReferenceID, el.MediaID, e.Type)
        })),
        Type: type[2] !== undefined ? type[2].slice(0, -1) : type[1].slice(0, -1),
        Country:e.Country,
        About:e.About,
        Length: e.Posts.length,
        CreatedAt: await moment(e.createdAt).fromNow()
    }
}));

 io.emit('realTimePostRender',await postsWithUserInfo)

   
})

});




io.on('disconnect',()=>{


});

function Disconnect() {
    if (clients > 0) {
        if (clients <= 2)
            this.broadcast.emit("Disconnect")
        clients--
    }
}

function SendOffer(offer) {
    this.broadcast.emit("BackOffer", offer)
}

function SendAnswer(data) {
    this.broadcast.emit("BackAnswer", data)
}


server.listen(port,()=>{
console.log(`Server is running on port ${port}.`);
})