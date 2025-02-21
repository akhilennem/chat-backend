const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose=require('mongoose')
const cors = require("cors");

const userRoute=require('./routes/userRoute');
const exp = require("constants");


const app = express();
app.use(express.json())
app.use(cors())
app.use(cors({
  origin: '*', // Allow specific origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));
app.use('/user',userRoute)
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


app.use(express.json());



const Messages=require('./models/messages')
const User=require('./models/user')
const MessageDashboard=require('./models/messageDashboard')

io.on("connection", (socket) => {
  
  console.log(`User connected: ${socket.id}`);

  socket.on("send_message", async (data) => {


    User.findOneAndUpdate({email:data.user},{$set:{
      socketID:socket.id
    }})
    console.log('message recieved ',data)
    const ifExist=await MessageDashboard.findOne({_id:data.chatID})
    if(ifExist){
      let newMessage=new Messages(data)
      newMessage.dashboardID=data.chatID;
      await newMessage.save()
      data.chatID=data.chatID;
      io.emit("receive_message", data); 
    }else{
    const from=data.user;
    const to=data.to;
   const dashboardData={from:from,to:to} 
   const saveDashBoard = new MessageDashboard(dashboardData);
   const savedData = await saveDashBoard.save()
   const newMessage=new Messages(data)
   newMessage.dashboardID=savedData._id
   await newMessage.save()
   data.chatID=savedData._id;
    io.to(socket.id).emit("receive_message", data); 
  }
  
});

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});


mongoose.connect('mongodb+srv://akhilnmtechintl:h2w0tMY73yxqgJmE@cloudapi.x5im9.mongodb.net/my-messages?retryWrites=true&w=majority') 
.then(() =>{
  
console.log('db connected')

})
  
