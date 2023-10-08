const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();
let instance = null;

const connection =mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT,
    timeout: 60000 
});

connection.connect((err) => {
    if(err){
        console.log(err.message);
    }
    console.log('database' + ' ' + connection.state);
});

class DbLearning {
    static getDbLearningInstance() {
        return instance ? instance : new DbLearning();
    }

    //login user
    async loginUser (email) {
        try {
            const query = 'SELECT * FROM users WHERE user_email = ?';
            const selectUser = await new Promise((resolve, reject) => {
                connection.query(query,[email], (err,result) => {
                    if (err) {
                        console.log('Error in executing query', err);
                        reject(err);
                    }
                    console.log(result[0]);
                    resolve(result);
                });
            });
            return selectUser;
        } catch (error) {
            console.log(error);
        }
    }
   
    //register users here
    async addUsers (formData) {
        try {
            const query ="INSERT INTO users (role, user_name, user_email, user_password, teacher_resume) VALUES (?,?,?,?,?)";
                const values = [
                    formData.userType,
                    formData.name,
                    formData.email,
                    formData.password,
                    formData.resume
                ]
            const addUser = await new Promise((resolve, reject) => {
                connection.query(query, values, (err, result) => {
                    if (err) {
                        console.log('Error in executing query', err);
                        reject(err);
                    }
                    resolve(result);
                });
            });
            return addUser;
        } catch (error) {
            console.log(error);
        }
    }

    //select users list

    async usersList() {
        try{
            const query = 'SELECT * FROM users_list';
            const selectUsers = await new Promise((resolve, reject) => {
                connection.query(query, (err, results) => {
                    if(err) {
                        reject(err);
                    }
                    resolve(results);
                });
            });
            return selectUsers;
        }catch (error) {
            console.log(error);
        }
    }
    //queries here

    //select admin details
    async getAdmin() {
        try{
            const query = "SELECT * FROM admins_table";
            const getAdminData = await new Promise((resolve, reject) => {
                connection.query(query, (err, result) => {
                    if(err){
                        console.log("Error in executing the query:", err);
                        reject(err);
                    }
                    resolve(result);
                });
            });
            return getAdminData;
        } catch (error) {
            console.log(error);
        }
    }
    //delete admin

}
    module.exports = DbLearning;