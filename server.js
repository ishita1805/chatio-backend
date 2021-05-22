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
  console.log('user connected')
  let connectedRooms = [];
  let id = ''

  socket.on('join', ({ userID, rooms }) => {
    console.log(userID, rooms);
    connectedRooms= rooms;
    id = userID;
    socket.join(rooms);

    io.to(rooms).emit('online', { userID });
  
  })

  socket.on('sendMessage',({ room, msg }) => {
    console.log(room)
    io.to(room).emit('message', { room, msg });
  })

  socket.on('deletedImage',({ id, room }) => {
    io.to(room).emit('reloadChat', { id, room });
  })

  socket.on('disconnect', () => {
    User.update({
      lastseen: new Date().toString(),
      online: false,
    }, { where: { id }})
    .then(() => {
      io.to(connectedRooms).emit('offline', { userID: id });
    })
    .catch((e) => {
        console.log(e);
    })
  })
});



http.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`)
})