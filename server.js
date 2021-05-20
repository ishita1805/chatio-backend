require('dotenv').config()

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const morgan = require('morgan');
const cors = require('cors')
const io = require("socket.io")(server);


require('./src/models')
require('./src/db/sequelize');

const port =  process.env.PORT || 4000


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
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

  socket.on('disconnect', () => {
    console.log('a user disconnected');
  })
});



server.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`)
})