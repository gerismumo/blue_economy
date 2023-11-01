const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser')
const dotenv = require('dotenv');
dotenv.config({path: './database/.env'});


const corsOptions = {
    origin: 'https://rsvp.blueeconomysummit.co.ke',
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
  };

app.use(cors(corsOptions));
app.use(express.json({ limit: '200mb' }));
app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));

// app.use(express.urlencoded({ extended: false }));

// Import routes
const routes = require('./routes/routes');


// Use routes
app.use('/', routes);
const port = process.env.PORT;

app.listen(process.env.PORT, () => console.log(`Server is running on port ${port}`));
