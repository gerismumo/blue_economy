const express = require('express');
const router = express.Router();
const DbService = require('../controller/controller');
const nodemailer = require('nodemailer');


router.post('/api/registerUsers', async(req, res) => {
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
      const eventTime = eventDetails[0].event_time;
      const formatTime = (timeString) => {
        const date = new Date(`2000-01-01T${timeString}`);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
    
        // Convert hours from 24-hour format to 12-hour format
        const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    
        // Pad single-digit minutes with leading zero
        const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
        return `${displayHours}:${displayMinutes} ${ampm}`;
      };
  
      const result = await db.addUsers(requestData);
      let config = {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: "geraldmumo6@gmail.com",
          pass: "dvuotqavfdvceqlg",
        }
      }
  
      let transporter = nodemailer.createTransport(config);
      // process.env.EMAIL_USERNAME
      const data = {
        from : 'noreply@gmail.com',
        to : requestData.email,
        subject: 'Welcome to Blue Economy Summit',
        text: `Dear ${requestData.name},\n\nThank you for registering for the Blue Economy Summit 2023. We are excited to have you join us!\n\nEvent Details:\nDate: ${formattedDate}\nLocation:\n${eventLocation}\nTime:\n${formatTime(eventTime)}\n\nLooking forward to seeing you at the event.\n\nBest regards,\nThe Blue Economy Summit Team`,
      };
  
      transporter.sendMail(data).then(() => {
        return 
      });
      res.json({success: true, data:result });
    } catch (error) {
      res.status(500).send({success:false, error: error.message});
    }
  });
  
  //select users 
  router.get('/api/usersList', (req, res) => {
    const db = DbService.getDbLearningInstance();
    const result = db.usersList();
  
    result.then(data => {
      res.json({success: true, data: data});
    })
    .catch(err => res.json({error: err}));
  });
  
  
  
  //delete admin
  router.delete('/api/deleteUser/:user_id', (req, res) => {
    const {user_id } = req.params;
     
    const db = DbService.getDbLearningInstance();
    const result = db.deleteUser(user_id);
    result
    .then(data => {
      res.json({success:true, data:data});
    })
    .catch(err => res.json({success:false, err:err}));
  });
  //edit admin
  
  router.put('/api/editUser/:user_id', (req, res) => {
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
    .catch(err => res.json({error: err}));
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
  
  router.post('/api/adminLogin', async (req, res) => {
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
      res.status(500).json({ success: false, error: err.message });
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
  
  router.put('/api/attendedStatuses', (req, res) => {
    const {userId, attendedStatus} = req.body;
  
    const db = DbService.getDbLearningInstance();
    const result = db.confirmAttend(userId, attendedStatus);
    result
    .then(data => {
      res.json({success:true, data:data});
    })
    .catch(err => res.json({error:err.message}));
  });
  
  router.get('/api/attendStatus', (req, res) => {
    const db = DbService.getDbLearningInstance();
    const result = db.selectAttendStatus();
    result
    .then(data => {
      res.json({success:true, data:data});
    })
    .catch((err) => res.json({error:err.message}));
  });
  
  router.get('/api/eventDetails', (req, res) => {
    const db = DbService.getDbLearningInstance();
    const result = db.getEventDetails();
    result 
    .then(data => {
      res.json({success: true, data:data});
    })
    .catch((err) => res.json({error: err.message}));
  });
  
  router.put('/api/updateDetails', (req, res) => {
    const {about_event, event_date,event_time, event_location  } = req.body;
  
    const db = DbService.getDbLearningInstance();
    const result = db.updateEventDetails(about_event, event_date,event_time, event_location );
    result
    .then(data => {
      res.json({success:true, data:data})
    })
    .catch(err => res.json({success:false, err:err}));
  });
  
  router.post('/api/addAdmin', async(req, res) => {
    const {name,email, password} = req.body;
  
    const db = DbService.getDbLearningInstance();
    try {
      const userExists = await db.getOrganiserByEmail(email);
      if (userExists) {
        return res.status(400).json({ success: false, error: 'User already registered' });
        
      }
      const result = await db.addAdmin(name,email, password);
      let config = {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: "geraldmumo6@gmail.com",
          pass: "dvuotqavfdvceqlg",
        }
      }
  
      const loginLink = `https://rsvp.blueeconomysummit.co.ke/login`;
  
      let transporter = nodemailer.createTransport(config);
  
      const data = {
        from : process.env.EMAIL_USERNAME,
        to : email,
        subject: 'Welcome to Blue Economy Summit ',
        text: `Dear ${name},\n\nYou have been added as a Event Organiser.\n\nLogin to the admin dashboard using this link: ${loginLink}\n\n  Your login details are: \n\n Email: ${email}\n\n Password: ${password}`,
      };
  
      transporter.sendMail(data).then(() => {
        return ;
      });
      res.json({success:true, data:result});
    } catch (error) {
      res.status(500).send({success:false, error:error.message})
    }
    
  });
  
  router.get('/api/adminList', (req, res) => {
   
    const db = DbService.getDbLearningInstance();
    const result = db.adminList();
    result
    .then(data => {
      res.json({success: true, data:data})
    }) 
    .catch(err => res.json({success: false, err:err}));
  });

  router.get('/api/organiserList', (req, res) => {
   
    const db = DbService.getDbLearningInstance();
    const result = db.organisersList();
    result
    .then(data => {
      res.json({success: true, data:data})
    }) 
    .catch(err => res.json({success: false, err:err}));
  });
  
  router.delete('/api/deleteAdmin/:admin_id', (req, res) => {
    const {admin_id} = req.params;
    const db = DbService.getDbLearningInstance();
    const result = db.deleteAdmin(admin_id);
    result
    .then(data => {
      req.json({success: true, data: data});
    })
    .catch(err => res.json({error: err}));
  });
  
  router.get('/api/combinedRoles', (req, res) => {
    const db = DbService.getDbLearningInstance();
    const result = db.combineRoles();
    result.then(data => {
      res.json({success: true, data: data});
    })
    .catch(err => res.json({error: err}));
  });

  module.exports = router;
  
  
  