const express = require('express');
const router = express.Router();
const DbService = require('../controller/controller');
const nodemailer = require('nodemailer');
const multer = require('multer');
const zlib = require('zlib');


const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });




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
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        }
      }
  
      let transporter = nodemailer.createTransport(config);
      // process.env.EMAIL_USERNAME
      const data = {
        from : process.env.EMAIL_USERNAME,
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


  router.post('/api/registerUsersCyber', async(req, res) => {
    const requestData = req.body;
    const db = DbService.getDbLearningInstance();
  
    try {
      const userExists = await db.getUserByEmailCyber(requestData.email);
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
  
      const result = await db.addUsersCyber(requestData);
      let config = {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        }
      }
  
      let transporter = nodemailer.createTransport(config);
      // process.env.EMAIL_USERNAME
      const data = {
        from : process.env.EMAIL_USERNAME,
        to : requestData.email,
        subject: 'Welcome to Blue Economy Summit',
        text: `Dear ${requestData.firstname},\n\nThank you for registering for the Blue Economy Summit 2023. We are excited to have you join us!\n\nEvent Details:\nDate: ${formattedDate}\nLocation:\n${eventLocation}\nTime:\n${formatTime(eventTime)}\n\nLooking forward to seeing you at the event.\n\nBest regards,\nThe Blue Economy Summit Team`,
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

  router.delete('/api/deleteUserCyber/:attendee_id', (req, res) => {
    const {attendee_id } = req.params;
    // console.log(attendee_id);
     
    const db = DbService.getDbLearningInstance();
    const result = db.deleteUserCyber(attendee_id);
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
    // const {selectedCounty} = req.body;
    // console.log(editingUser);
  
    const user_email = editingUser.user_email;
    const user_name  = editingUser.user_name;
    const company = editingUser.company;
    const phone_number = editingUser.phone_number;
    const user_interest = editingUser.user_interest;
    const attendee_county = editingUser.attendee_county;
    console.log(user_id,
      user_email,user_name,  company,phone_number,
     user_interest,attendee_county);
    const db = DbService.getDbLearningInstance();
    const result = db.editUsers(user_id,
       user_email,user_name,  company,phone_number,
      user_interest,attendee_county);
    result
    .then(data => {
      res.json({success: true, data:data});
    })
    .catch(err => res.json({error: err}));
  });
  
  //
  router.put('/api/editUserCyber/:attendee_id', (req, res) => {
    const {attendee_id} = req.params;
    const editingUser = req.body;
    // const {selectedCounty} = req.body;
    // console.log(editingUser);
  
    const user_email = editingUser.email;
    const user_name  = editingUser.full_name;
    const company = editingUser.company;
    const phone_number = editingUser.phone_number;
    const user_interest = editingUser.attendee_interest;
    const attendee_county = editingUser.attendee_county;
    // console.log(attendee_id,
    //   user_email,user_name,  company,phone_number,
    //  user_interest,attendee_county);
    const db = DbService.getDbLearningInstance();
    const result = db.editUsersCyber(attendee_id,
       user_email,user_name,  company,phone_number,
      user_interest,attendee_county);
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
  
  router.put('/api/attendedStatuses', async (req, res) => {
    const {userId, attendedStatus} = req.body;
    // console.log(attendedStatus);
    // console.log(userId);
    const db = DbService.getDbLearningInstance();
    try {
      const getUserDetails = await db.getUserByUserId(userId);
      const getEmail = getUserDetails[0].user_email;
      const getName = getUserDetails[0].user_name;
      // console.log(getEmail);
      // console.log(getName);
      const data =  await db.confirmAttend(userId, attendedStatus);
      res.json({success:true, data:data});
      if(attendedStatus === true) {
        let config = {
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          secure: process.env.EMAIL_SECURE,
          auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
          }
        }
    
        const loginLink = `https://blueeconomysummit.co.ke/`;
    
        let transporter = nodemailer.createTransport(config);
    
        const result = {
          from : process.env.EMAIL_USERNAME,
          to : getEmail,
          subject: 'Welcome to Blue Economy Summit ',
          text: `Dear ${getName},\n\nYou thank you for attending the Blue Economy Summit:\n\n Check out the event activities here:\n\n ${loginLink}\n`,
        };
    
        transporter.sendMail(result).then(() => {
          return ;
        });
      }
    } catch (error) {
      throw(error);
    }
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

  router.get('/api/attendStatusCyber', (req, res) => {
    const db = DbService.getDbLearningInstance();
    const result = db.selectAttendStatusCyber();
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
    const result = db.updateEventDetails(about_event, event_date,event_time, event_location);
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
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
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

  router.post('/api/uploadFile',  (req, res) => {
  const jsonData = req.body;
  // console.log(jsonData);
    const db = DbService.getDbLearningInstance();
    const result = db.fileUpload(jsonData);
    // console.log(jsonData);
    result.then(data => {
      res.json({success: true, data: data});
    })
    .catch(err => res.json({error: err}));
  });

  router.post('/api/checkRegistration', async (req, res) => {
    const {email} = req.body;
    const db = DbService.getDbLearningInstance();
    try {
      const getUserDetails = await  db.getUserByEmail(email);
      // console.log(getUserDetails);
      const getCyberData = await db.getUserByEmailCyber(email);
      // const fileDetails = await db.selectFile();
      // console.log(fileDetails[0].file_name);
      await db.updateAttendStatusCyber(email);
      function getWeek(date) {
        const currentDate = new Date(date);
        currentDate.setHours(0, 0, 0, 0);
        currentDate.setDate(currentDate.getDate() + 4 - (currentDate.getDay() || 7));
        const yearStart = new Date(currentDate.getFullYear(), 0, 1);
        const weekNo = Math.ceil(((currentDate - yearStart) / 86400000 + 1) / 7);
        return weekNo;
      }
      const dayOfWeek = new Date().getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
      const currentDate = new Date();
      if(getUserDetails) {
        if (dayOfWeek === 3 && getWeek(currentDate) === getWeek(new Date())) {
          await db.updateAttendStatus(email);
          res.json({success: true, message:'Email confirmed successfully'})
        }else{
          res.json({success: false, message:'Not allowed to attend Today'})
        }
      } else if(getCyberData){
        if (dayOfWeek === 2 && getWeek(currentDate) === getWeek(new Date())) {
          await db.updateAttendStatusCyber(email);
          res.json({success: true, message:'Email confirmed successfully'})
        }else{
          res.json({success: false, message:'Not allowed to attend Today'})
        }
         
      } else {
        res.json({success: false, message:'Email Not Found'})
      }
      
    } catch (error) {
      throw(error);
    }
  })

  //cyber security animationPlayState: 

  router.post('/api/uploadCyberFile',  (req, res) => {
    const jsonData = req.body;
    // console.log(jsonData);
      const db = DbService.getDbLearningInstance();
      const result = db.fileUploadCyber(jsonData);
      // console.log(jsonData);
      result.then(data => {
        res.json({success: true, data: data});
      })
      .catch(err => res.json({error: err}));
    });

    router.get('/api/cyberSecurityList', (req, res) => {
      const db = DbService.getDbLearningInstance();
      const result = db.cyberSecurityList();
    
      result.then(data => {
        res.json({success: true, data: data});
      })
      .catch(err => res.json({error: err}));
    });

    router.put('/api/attendedStatusesCyber', async (req, res) => {
      const {userId, attendedStatus} = req.body;
      // console.log(attendedStatus);
      // console.log(userId);
      const db = DbService.getDbLearningInstance();
      try {
        const getUserDetails = await db.getUserByUserIdCyber(userId);
        const getEmail = getUserDetails[0].email;
        const getName = getUserDetails[0].first_name;
        // console.log(getEmail);
        // console.log(getName);
        const data =  await db.confirmAttendCyber(userId, attendedStatus);
        res.json({success:true, data:data});
        if(attendedStatus === true) {
          let config = {
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE,
            auth: {
              user: process.env.EMAIL_USERNAME,
              pass: process.env.EMAIL_PASSWORD,
            }
          }
      
          const loginLink = `https://blueeconomysummit.co.ke/`;
      
          let transporter = nodemailer.createTransport(config);
      
          const result = {
            from : process.env.EMAIL_USERNAME,
            to : getEmail,
            subject: 'Welcome to Blue Economy Summit ',
            text: `Dear ${getName},\n\nYou thank you for attending the Blue Economy Summit:\n\n Check out the event activities here:\n\n ${loginLink}\n`,
          };
      
          transporter.sendMail(result).then(() => {
            return ;
          });
        }
      } catch (error) {
        throw(error);
      }
    });

    router.put('/api/updateSubmit', async(req, res) => {
      const data = req.body;
      const selectedCounty = data.selectedCounty;
      const areaOfInterest = data.areaOfInterest;
      const email = data.email;
      console.log(selectedCounty, areaOfInterest, email);
      const db = DbService.getDbLearningInstance();
      try {
        await db.updateAttendeeData(selectedCounty, areaOfInterest, email);
       await db.updateAttendeeDataCyber(selectedCounty, areaOfInterest, email);
        const getUserDetails = await  db.getUserByEmail(email);
        const getCyberData = await db.getUserByEmailCyber(email);
        // console.log(getUserDetails);
        await db.getUserByEmailCyber(email);
        await db.selectFile();
        const fileDetails = await db.selectFile();
        // console.log(fileDetails[0].file_name);
        await db.updateAttendStatusCyber(email);

        if(getUserDetails ) {
          const getEmail = getUserDetails.user_email;
          const getName = getUserDetails.user_name;
          // console.log(getEmail);
          // console.log(getName);
          let config = {
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE,
            auth: {
              user: process.env.EMAIL_USERNAME,
              pass: process.env.EMAIL_PASSWORD,
            }
          }
      
          const loginLink = `https://blueeconomysummit.co.ke/`;
      
          let transporter = nodemailer.createTransport(config);
      
          const result = {
            from : process.env.EMAIL_USERNAME,
            to : getEmail,
            subject: 'Welcome to Blue Economy Summit ',
            text: `Dear ${getName},\n\nYou thank you for attending the Blue Economy Summit:\n\n Check out the event activities here:\n\n ${loginLink}\n`,
            attachments: [
              {
                filename: fileDetails[0].file_name, 
                content: fileDetails[0].file, 
              },
            ],
    
          };
      
          transporter.sendMail(result).then(() => {
            return ;
          });
          res.json({success: true});
        } else if(getCyberData){
          // const getCyberData = await db.getUserByEmailCyber(email);
          // console.log(getCyberData);
          const getEmailCyber = getCyberData.email;
          const getNameCyber = getCyberData.first_name;
  
          let config = {
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE,
            auth: {
              user: process.env.EMAIL_USERNAME,
              pass: process.env.EMAIL_PASSWORD,
            }
          }
      
          const loginLink = `https://blueeconomysummit.co.ke/`;
      
          let transporter = nodemailer.createTransport(config);
      
          const result = {
            from : process.env.EMAIL_USERNAME,
            to : getEmailCyber,
            subject: 'Welcome to Blue Economy Summit ',
            text: `Dear ${getNameCyber},\n\nYou thank you for attending the Blue Economy Summit:\n\n Check out the event activities here:\n\n ${loginLink}\n`,
            attachments: [
              {
                filename: fileDetails[0].file_name, 
                content: fileDetails[0].file, 
              },
            ],
          };
      
          transporter.sendMail(result).then(() => {
            return ;
          });
          res.json({success: true})
        } else {
          res.json({success: false})
        }
        // res.json({success:true, data:result});
      } catch (error) {
        throw(error);
      }

    })

    router.put('/api/upload/:fileId', upload.single('file'), async(req, res) => {
      const {fileId} = req.params;
      // console.log('fileId',fileId);
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
      }
      const fileData = req.file.buffer;
      const fileName = req.file.originalname;
    ;
      const db = DbService.getDbLearningInstance();
      
      try {
        const result = await db.fileUploads(fileData, fileName,fileId);
        res.json({success: true, message: result})
      }catch(error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    router.get('/api/fileDetails', (req, res) => {
      const db = DbService.getDbLearningInstance();
      const result = db.selectFile();
      result
      .then((data) => res.json({success: true, data: data}))
      .catch((err) => res.json({success: false, err: err}))
    });

    router.get('/api/counties', (req, res) => {
      try {
        const data = require('../data/counties.json');
        res.json({success: true, data});
      } catch (error) {
        console.error('Error reading JSON data:', error);
        res.status(500).json({success: false, error: 'Internal Server Error' });
      }
    });
    
  module.exports = router;
  
  
  