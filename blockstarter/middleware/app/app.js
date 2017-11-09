const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
// const config = require('./config/database');

// Connect To Database
// mongoose.connect(config.database);

// On Connection
// mongoose.connection.on('connected', () => {
//     console.log('Connected to database ' + config.database);
// });

// On Error
// mongoose.connection.on('error', (err) => {
//     console.log('Database error: ' + err);
// });

const app = express();

// Port Number
const port = 8080;

// CORS Middleware
app.use(cors());

// Set Static Folder
//app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());


// Set routes
// const users = require('./routes/users');
// const projects = require('./routes/projects');
// app.use('/users', users);
// app.use('/projects', projects);