const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const greeters = require('./routes/greeters');
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
const port = 3000;

// CORS Middleware
app.use(cors());

// Set Static Folder
//app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());


// Set routes
app.use('/greeters', greeters);

// Index Route
app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});

// Start Server
app.listen(port, () => {
  console.log('Server started on port '+port);
});