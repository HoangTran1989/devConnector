const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/apis/users');
const profile = require('./routes/apis/profile');
const posts = require('./routes/apis/posts');

const app = express();

//Body parser middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//DBCONFIG
const db = require('./config/keys').mongoURI;

//Connect to MongoDB
mongoose.connect(db,{ useNewUrlParser: true })
        .then(()=> console.log('Server connected'))
        .catch(err => console.log(err));

//Passport Middleware
app.use(passport.initialize());

//passport cofig
require('./config/passport')(passport);

//Routes
app.use('/apis/users',users);
app.use('/apis/profile',profile);
app.use('/apis/posts',posts);


const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`Server running on port ${port}`));