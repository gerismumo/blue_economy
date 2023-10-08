const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//multer



const DbService = require('./DbService');



//login user
app.post('/loginUser', async (req, res) => {

  const {email, password } = req.body;
  
  if(!email || !password) {
    res.status(400).json({success: false, message: "Please Enter both email and password."});
    return;
  }
  try{
    const db = DbService.getDbLearningInstance();
    const users = await db.loginUser(email);
  

    if(!users || users.length === 0 ) {
      return res.status(401).json({success: false, message: "User not found, Please register!"});
    }
    const user = users[0];

    console.log('Input Password:', password);
    console.log('User Password:', user.user_password);

    const passwordMatch = (user.user_password === password);
    console.log(passwordMatch);
    if(passwordMatch && user.role ==="teacher"){
      return res.json({ success: true, role: "teacher" });
    } else if(passwordMatch && user.role === "student") {
      return res.json({success: true, role:"student"});
    } else{
      res.status(401).json({success: false, message: "Invalid password"});
    }
  

  } catch (error) {
    console.log(error);
  }
});

//register user
app.post('/signUpUsers', (req, res) => {
  const requestData = req.body;
  const db = DbService.getDbLearningInstance();

  const result = db.addUsers(requestData);

  result.then(data => {
    res.json({success: true, data: data});
  })
  .catch(err => console.log(err));
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

//select admins data
app.get('/getAdminsList', (req, res) => {
  const db = DbService.getDbLearningInstance();
  const result = db.getAdmin();

  result
  .then(data => {
    res.json({success: true, data: data});
  })
  .catch(err => console.log(err)); 
});

//delete admin
app.delete('/deleteAdmin/:admin_id', (req, res) => {
  const {admin_id } = req.params;

  const db = DbService.getDbLearningInstance();
  const result = db.deleteAdmin(admin_id);
  result
  .then(data => {
    res.json({success:true, data:data});
  })
  .catch(err => console.log(err));
});
//edit admin
            

app.listen(process.env.PORT, () => console.log('server is running'));
