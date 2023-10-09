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

    //register users here
    async addUsers (requestData) {
        try {
            const query ='INSERT INTO users_list (user_email,user_name,occupation, company, phone_number, industry_in, hear_about_event, attend_last_year, user_interest, join_newsletter, join_as, describe_product, category_fall) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)';
                const values = [
                    requestData.email,
                    requestData.name,
                    requestData.occupation,
                    requestData.company,
                    requestData.phoneNumber,
                    requestData.industry,
                    requestData.selectedCheckBoxes,
                    requestData.attendLastYear,
                    requestData.areaOfInterests,
                    requestData.joinMailList,
                    requestData.JoinAs,
                    requestData.describeYourProduct,
                    requestData.categoryFall,
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
    
    //delete users

    async deleteUser(user_id) {
        try {
            const query = 'DELETE FROM users_list WHERE user_id = ? '
            const deleteUser = await new Promise((resolve, reject) => {
                connection.query(query, [user_id], (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(result);
                });
            });
            return deleteUser;
        } catch (error) {
            console.log(error);
        }
    }

    //edit users
    async  editUsers(user_id,
        user_email,user_name, occupation, company,phone_number, industry_in,
        hear_about_event, attend_last_year, user_interest, join_newsletter,join_as,
        describe_product, category_fall) {
        try {
          const query = `UPDATE users_list SET user_email = ?, user_name = ?, occupation = ?, company = ?, phone_number = ?, industry_in = ?, hear_about_event = ?, attend_last_year = ?, user_interest = ?, join_newsletter = ?, join_as = ?, describe_product = ?, category_fall = ? WHERE user_id = ?`;
         
        
          const editUser = await new Promise((resolve, reject) => {
            connection.query(
              query,
              [
                user_email,user_name ,occupation, company,phone_number, industry_in,
        hear_about_event, attend_last_year, user_interest, join_newsletter,join_as,
        describe_product, category_fall, user_id
              ],
              (err, result) => {
                if (err) {
                  reject(err);
                }
                
                resolve(result);
              }
            );
          });
      
          return editUser;
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
     
      //add new user

}
    module.exports = DbLearning;