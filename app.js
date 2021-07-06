//comments
const express = require('express');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const mongoDbStore = require('connect-mongodb-session')(session);
const authorized = require('./routes/authorized');
const unauthorized = require('./routes/unauthorized');
const db = require('./config/keys').mongoURI;
mongoose
  .connect(db,{ useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true })
  .then(()=>console.log('MongoDB Connected'))
  .catch(err=> console.log(err));
const port = process.env.PORT||3000;
const store = new mongoDbStore({
  uri:db,
  collection:'sessions'
})
app.set('view engine','ejs');
app.use(session({
  secret :'qwert',
  resave:false,  
  saveUninitialized:false,
  store:store
}));

app.use(bodyParser.urlencoded({urlencoded:false}));
app.use(express.static(path.join(path.dirname(process.mainModule.filename),"/public/")));
app.use('/authorized',authorized);

app.use('/',unauthorized);

app.use((req,res,next)=>{
    res.status(404).render('404',{title:'Page not found'});
  }
)
app.listen(port,(err)=>{
    console.log('App listening on port : '+port);
});