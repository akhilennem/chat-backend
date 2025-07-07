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

io.on("connection", async (socket) => {
  console.log(`User connected: ${socket.id}`);
  console.log(`Email: ${socket.handshake.query.userEmail}`);
  // Update user's socketID when they connect
  try {
    await User.findOneAndUpdate(
      { email: socket.handshake.query.userEmail }, 
      { $set: { socketID: socket.id } }
    );
  } catch (err) {
    console.error("Error updating socketID:", err);
  }

  socket.on("send_message", async (data) => {
    try {
      console.log('Message received:', data);

      // Find the recipient's socket ID
      const recipient = await User.findOne({ email: data.to });


      // Check if the chat exists
      const ifExist = await MessageDashboard.findOne({ _id: data.chatID });

      if (ifExist) {
        let newMessage = new Messages(data);
        newMessage.dashboardID = data.chatID;
        await newMessage.save();
        data.chatID = data.chatID;
      } else {
        // Create a new chat dashboard
        const dashboardData = { from: data.user, to: data.to };
        const saveDashBoard = new MessageDashboard(dashboardData);
        const savedData = await saveDashBoard.save();
        
        let newMessage = new Messages(data);
        newMessage.dashboardID = savedData._id;
        await newMessage.save();
        data.chatID = savedData._id;
      }

      if (recipient || recipient.socketID) {
        io.to(recipient.socketID).emit("receive_message", data);
      }
    } catch (err) {
      console.error("Error processing message:", err);
    }
  });

  socket.on("disconnect", async () => {
    console.log(`User disconnected: ${socket.id}`);

    // Remove the socket ID when the user disconnects
    try {
      await User.findOneAndUpdate(
        { socketID: socket.id }, 
        { $set: { socketID: "" } }
      );
    } catch (err) {
      console.error("Error removing socketID:", err);
    }
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});

const url="mongodb://localhost:27017/"
// const url="mongodb+srv://akhilnmtechintl:h2w0tMY73yxqgJmE@cloudapi.x5im9.mongodb.net/my-messages?retryWrites=true&w=majority"
mongoose.connect(url) 
.then(() =>{
  
console.log('db connected')

})
  
