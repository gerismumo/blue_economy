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

// async function isUserRegistered(email) {
//   const db = DbService.getDbLearningInstance();
//   const user = db.getUserByEmail(email);
//   return user !== null;
// }

//register user
app.post('/api/registerUsers', async(req, res) => {
  const requestData = req.body;
  const db = DbService.getDbLearningInstance();

  try {
    const userExists = await db.getUserByEmail(requestData.email);
    if (userExists) {
      return res.status(400).json({ success: false, error: 'User already registered' });
      
    }
    const eventDetails = await db.getEventDetails();
    const eventDate = eventDetails[0].event_date;
    const formattedDate = new Date(eventDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
      });
    const eventLocation = eventDetails[0].event_location;

    const result = await db.addUsers(requestData);
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
      text: `Dear ${requestData.name},\n\nThank you for registering for the Blue Economy Summit 2023. We are excited to have you join us!\n\nEvent Details:\nDate: ${formattedDate}\nLocation:\n${eventLocation}\n\nLooking forward to seeing you at the event.\n\nBest regards,\nThe Blue Economy Summit Team`,
    };

    transporter.sendMail(data).then(() => {
      return 
    });
    res.json({success: true, data:result });
  } catch (error) {
    console.log(error);
    res.status(500).send({success:false, error: error.message});
  }
});

//select users 
app.get('/api/usersList', (req, res) => {
  const db = DbService.getDbLearningInstance();
  const result = db.usersList();

  result.then(data => {
    res.json({success: true, data: data});
  })
  .catch(err => console.log(err));
});



//delete admin
app.delete('/api/deleteUser/:user_id', (req, res) => {
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

app.put('/api/editUser/:user_id', (req, res) => {
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

// app.post('/api/adminLogin', async(req, res) => {
//   const {email, password} = req.body;
//   const db = DbService.getDbLearningInstance();
//   console.log(db);
//   const result = db.loginAdmin(email, password);
//   // console.log(result);
//   result
//     .then((loginSuccessful) => {
//       if (loginSuccessful) {
//         const adminData = await db.getAdminEmail(email);
//         res.json({ success: true, message: 'Login successful' });
//     }else {
//       res.status(401).json({ success: false, message: 'Invalid email and password' });
//     }
//   })
//   .catch((err) => {
//     console.log(err);
//     res.status(500).json({ success: false, error: 'Server error' });
//   });
// })

app.post('/api/adminLogin', async (req, res) => {
  const { email, password } = req.body;
  const db = DbService.getDbLearningInstance();

  try {
    const loginSuccessful = await db.loginAdmin(email, password);

    if (loginSuccessful) {
      const adminData = await db.getAdminEmail(email);
      // console.log('adminData',adminData);
      res.json({ success: true, message: 'Login successful', adminData });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email and password' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});


//   try {
//     const { email, password } = req.body;
//     const db = DbService.getDbLearningInstance();
//     const admin = await db.getOrganiserByEmail(email);

//     if (!admin) {
//       return res.status(401).json({ success: false, message: 'Invalid email or password' });
//     }

//     const isPasswordValid = password === admin.admin_password;

//     if (!isPasswordValid) {
//       return res.status(401).json({ success: false, message: 'Invalid email or password' });
//     }

//     res.json({ success: true, message: 'Login successful' });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

app.put('/api/attendedStatuses', (req, res) => {
  const {userId, attendedStatus} = req.body;

  const db = DbService.getDbLearningInstance();
  const result = db.confirmAttend(userId, attendedStatus);
  result
  .then(data => {
    res.json({success:true, data:data});
  })
  .catch(err => console.log(err));
});

app.get('/api/attendStatus', (req, res) => {
  const db = DbService.getDbLearningInstance();
  const result = db.selectAttendStatus();
  result
  .then(data => {
    res.json({success:true, data:data});
  })
  .catch((err) => console.log(err));
});

app.get('/api/eventDetails', (req, res) => {
  const db = DbService.getDbLearningInstance();
  const result = db.getEventDetails();
  result 
  .then(data => {
    res.json({success: true, data:data});
  })
  .catch((err) => console.log(err));
});

app.put('/api/updateDetails', (req, res) => {
  const {about_event, event_date, event_location  } = req.body;

  const db = DbService.getDbLearningInstance();
  const result = db.updateEventDetails(about_event, event_date, event_location );
  result
  .then(data => {
    res.json({success:true, data:data})
  })
  .catch(err => res.json({success:false, err:err}));
});

app.post('/api/addAdmin', async(req, res) => {
  const {name,email, password} = req.body;

  const db = DbService.getDbLearningInstance();
  try {
    const userExists = await db.getOrganiserByEmail(email);
    if (userExists) {
      return res.status(400).json({ success: false, error: 'User already registered' });
      
    }
    const result = await db.addAdmin(name,email, password);
    let config = {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    }

    const loginLink = `http://your-frontend-url/login?token`;

    let transporter = nodemailer.createTransport(config);

    const data = {
      from : process.env.EMAIL_USERNAME,
      to : email,
      subject: 'Welcome to Blue Economy Summit ',
      text: `Dear ${name},\n\nYou have been added as an admin.\n\nLogin to the admin dashboard using this link: ${loginLink}\n\n  Your login details are: \n\n Email: ${email}\n\n Password: ${password}`,
    };

    transporter.sendMail(data).then(() => {
      return ;
    });
    res.json({success:true, data:result});
  } catch (error) {
    console.log(error);
    res.status(500).send({success:false, error:'Server error'})
  }
  
});

app.get('/api/adminList', (req, res) => {
 
  const db = DbService.getDbLearningInstance();
  const result = db.adminList();
  result
  .then(data => {
    res.json({success: true, data:data})
  }) 
  .catch(err => res.json({success: false, err:err}));
});

app.delete('/api/deleteAdmin/:admin_id', (req, res) => {
  const {admin_id} = req.params;
  const db = DbService.getDbLearningInstance();
  const result = db.deleteAdmin(admin_id);
  result
  .then(data => {
    req.json({success: true, data: data});
  })
  .catch(err => res.json({error: err}));
});

app.get('/api/combinedRoles', (req, res) => {
  const db = DbService.getDbLearningInstance();
  const result = db.combineRoles();
  result.then(data => {
    res.json({success: true, data: data});
  })
  .catch(err => res.json({error: err}));
});


app.listen(process.env.PORT, () => console.log('server is running'));
