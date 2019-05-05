const express = require('express');
const mongoose = require('mongoose');

const users = require('./routes/apis/users');
const profile = require('./routes/apis/profile');
const posts = require('./routes/apis/posts');

const app = express();

//DBCONFIG
const db = require('./config/keys').mongoURI;

//Connect to MongoDB
mongoose.connect(db)
        .then(()=> console.log('Server connected'))
        .catch(err => console.log(err));

app.get('/',(req,res)=> res.send('Nodemon is here'));

//Routes
app.use('/apis/users',users);
app.use('/apis/profile',profile);
app.use('/apis/posts',posts);


const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`Server running on port ${port}`));