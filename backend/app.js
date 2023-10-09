const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//multer



const DbService = require('./DbService');


//register user
app.post('/registerUsers', (req, res) => {
  const requestData = req.body;
  const db = DbService.getDbLearningInstance();

  try {
    const result = db.addUsers(requestData);
    //handle send email data

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      },
    });

    const emailData = {
      from: process.env.EMAIL_USERNAME,
      to: requestData.user_email,
      subject: 'Event Registration Confirmation',
      text: 'Thank you for registering for the event.'
    };

    transporter.sendMail(emailData, (error, info) => {
      if (error) {
        console.log('Error sending the email:', error);
      } else {
        console.log('Email send', info.response)
      }
    });
    res.json({success: true, data:result });
  } catch (error) {
    console.log(error);
    res.status(500).send({success:false, error:'Server error'});
  }
});

//select users 
app.get('/usersList', (req, res) => {
  const db = DbService.getDbLearningInstance();
  const result = db.usersList();

  result.then(data => {
    res.json({success: true, data: data});
  })
  .catch(err => console.log(err));
});



//delete admin
app.delete('/deleteUser/:user_id', (req, res) => {
  const {user_id } = req.params;
   
  const db = DbService.getDbLearningInstance();
  const result = db.deleteUser(user_id);
  result
  .then(data => {
    res.json({success:true, data:data});
  })
  .catch(err => console.log(err));
});
//edit admin

app.put('/editUser/:user_id', (req, res) => {
  const {user_id} = req.params;
  const editingUser = req.body;

  const user_email = editingUser.user_email;
  const user_name  = editingUser.user_name;
  const occupation = editingUser.occupation;
  const company = editingUser.company;
  const phone_number = editingUser.phone_number;
  const industry_in = editingUser.industry_in;
  const hear_about_event = editingUser.hear_about_event;
  const attend_last_year = editingUser.attend_last_year;
  const user_interest = editingUser.user_interest;
  const join_newsletter = editingUser.join_newsletter;
  const join_as = editingUser.join_as;
  const describe_product = editingUser.describe_product;
  const category_fall = editingUser.category_fall;

  const db = DbService.getDbLearningInstance();
  const result = db.editUsers(user_id,
     user_email,user_name, occupation, company,phone_number, industry_in,
     hear_about_event, attend_last_year, user_interest, join_newsletter,join_as,
     describe_product, category_fall);
  result
  .then(data => {
    res.json({success: true, data:data});
  })
  .catch(err => console.log(err));
});

//admin login

app.post('/adminLogin', (req, res) => {
  const {email, password} = req.body;
  const db = DbService.getDbLearningInstance();
  const result = db.loginAdmin(email, password);

  result
    .then((loginSuccessful) => {
      if (loginSuccessful) {
        res.json({ success: true, message: 'Login successful' });
    }else {
      res.status(401).json({ success: false, message: 'Invalid email and password' });
    }
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json({ success: false, error: 'Server error' });
  });
})

app.listen(process.env.PORT, () => console.log('server is running'));
