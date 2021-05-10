const express = require('express')
require('dotenv').config()
const cookieParser = require('cookie-parser')
const morgan = require('morgan');
require('./src/models')
require('./src/db/sequelize');
const port =  process.env.PORT || 4000

const app = express();
var http = require("http").Server(app)
var io = require('socket.io')(http)

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header(
      "Access-Control-Allow-Headers",
      "Set-Cookie,Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Credentials", true);
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
      return res.status(200).json({});
    }
    next();
});

const userRoutes = require("./src/routes/user");
const reqRoutes = require("./src/routes/request");
const contactRoutes = require("./src/routes/contact");

app.use("/users", userRoutes);
app.use("/request", reqRoutes);
app.use("/contact", contactRoutes);

app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`)
})