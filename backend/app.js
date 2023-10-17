const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({path: './database/.env'});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import routes
const routes = require('./routes/routes');

// Use routes
app.use('/', routes);
const port = process.env.PORT;

app.listen(process.env.PORT, () => console.log(`Server is running on port ${port}`));
