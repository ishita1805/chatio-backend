require('dotenv').config()

const express = require('express');
const app = express();
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const User = require('./src/models/users')

const cors = require('cors')


require('./src/models')
require('./src/db/sequelize');

const port =  process.env.PORT || 4000


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(fileUpload({
  useTempFiles:true
}));

app.use(cors({
  origin:'http://localhost:3000',
  credentials: true,
}))

const userRoutes = require("./src/routes/user");
const reqRoutes = require("./src/routes/request");
const contactRoutes = require("./src/routes/contact");
const messageRoutes = require("./src/routes/message");

app.use("/users", userRoutes);
app.use("/request", reqRoutes);
app.use("/contact", contactRoutes);
app.use("/message", messageRoutes);

io.on('connection', (socket) => {
  // console.log('user connected')
  let connectedRooms = [];
  let id = ''

  socket.on('join', ({ userID, rooms }) => {
    connectedRooms = rooms;
    id=userID;
    console.log('updated online')
    socket.join(rooms);
    console.log(`${userID} joined all rooms`);
    User.update({ 
      online: true,
      lastseen: new Date().toString(),
     },{ where: { id } })
      .then(() => {
        rooms.forEach((room) => {
          socket.broadcast.to(room).emit('online',{ userID, room });
        })
      })
      .catch((e) => {
        console.log(e);
      })
    
  })

  socket.on('read_notif',({ room }) => {
    socket.broadcast.to(room).emit('update_read');
  })

  socket.on('sendMessage',({ userID, room, msg }) => {
    io.to(room).emit('messageTrigger', { userID, room, msg });
  })

  socket.on('deletedImage',({ id, room }) => {
    io.to(room).emit('reloadChat', { id, room });
  })

  socket.on('request', ({ id }) => {
    io.emit('request_socket',({ id }));
  })

  socket.on('request_accepted', ({ id }) => {
    io.emit('request_socket_accept',({ id }));
  })


  socket.on('disconnect', () => {
    console.log('disconnect');
    User.update({ 
      online: false,
      lastseen: new Date().toString(),
     },{ where: { id } })
      .then(() => {
        connectedRooms.forEach((room) => {
          console.log(room);
          socket.broadcast.to(room).emit('offline',{ id, room });
        })
      })
      .catch((e) => {
        console.log(e);
      })
  })

});

http.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`)
})