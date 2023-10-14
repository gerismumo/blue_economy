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
    let config = {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    }

    let transporter = nodemailer.createTransport(config);

    const data = {
      from : process.env.EMAIL_USERNAME,
      to : requestData.email,
      subject: 'Welcome to Blue Economy Summit',
      text: `Dear ${requestData.name},\n\nThank you for registering for the Blue Economy Summit 2023. We are excited to have you join us!\n\nEvent Details:\nDate: October 25, 2023\nLocation:\nMombasa\n\nLooking forward to seeing you at the event.\n\nBest regards,\nThe Blue Economy Summit Team`,
    };

    transporter.sendMail(data).then(() => {
      return console.log('Sent mail')
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

app.put('/attendedStatuses', (req, res) => {
  const {userId, attendedStatus} = req.body;

  const db = DbService.getDbLearningInstance();
  const result = db.confirmAttend(userId, attendedStatus);
  result
  .then(data => {
    res.json({success:true, data:data});
  })
  .catch(err => console.log(err));
});

app.get('/attendStatus', (req, res) => {
  const db = DbService.getDbLearningInstance();
  const result = db.selectAttendStatus();
  result
  .then(data => {
    res.json({success:true, data:data});
  })
  .catch((err) => console.log(err));
});

app.get('/eventDetails', (req, res) => {
  const db = DbService.getDbLearningInstance();
  const result = db.getEventDetails();
  result 
  .then(data => {
    res.json({success: true, data:data});
  })
  .catch((err) => console.log(err));
});

app.put('/updateDetails', (req, res) => {
  const {about_event, event_date, event_location  } = req.body;

  const db = DbService.getDbLearningInstance();
  const result = db.updateEventDetails(about_event, event_date, event_location );
  result
  .then(data => {
    res.json({success:true, data:data})
  })
  .catch(err => res.json({success:false, err:err}));
})


app.listen(process.env.PORT, () => console.log('server is running'));
