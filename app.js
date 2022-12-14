var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
const openRoutes = require("./AppModule/baseRoutes/routers.open");
const closeRouteController = require("./AppModule/baseRoutes/controller");
const closeRoutes = require("./AppModule/baseRoutes/routes.close");
const multer = require('multer')
const upload = multer()

const {
  verifyUser
} = closeRouteController;



var app = express();
const server = require('http').createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, {
  pingTimeout: 40000, serveClient: true, allowRequest: (req, callback) => {
    callback(null, true)
  }
})
module.exports = { io }
require('./AppModule/Api/helpers/sockets')

// require('./AppModule/Api/helpers/sockets')


// io.on('connection', (socket) => {
//   console.log('a user connected...',socket.rooms.entries());
// socket.on('disconnect', () => {
//   console.log('disconnect user...');
// })
// socket.on('ready_for_chat', (data) => {
//   io.emit('ready_for_chat_recieve', 'hello world')
// })
// io.on('disconnect', () => {
//   console.log('disconnect user...');
// })
// socket.emit('enteredvalue', 'adsfjhakdlsf')
// })

// io.onx

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

dotenv.config();
mongoose.connect(process.env.DB_DEV, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// mongoose.set("useFindAndModify", false);
mongoose.connection.on("connected", () => {
  console.log("Connected To Data Base ...");
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(upload.any())

app.get('/checkrouter', (req, res) => {
  console.log("connection successful as;lkdhflasdhfjkashdf");
  res.json({
    message: 'ok connection'
  })
})
app.use(openRoutes);
app.use(
  // upload.any(),
  verifyUser,
  closeRoutes
);




// app.use('/' () => {

// });
// app.use('/users', usersRouter);








// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = { app, server }
// const PORT = process.env.PORT || 3000

// app.listen(PORT, () => {
//   console.log('server is running on port ...', PORT);
// })


