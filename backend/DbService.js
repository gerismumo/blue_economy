
const connection = require('./config');
let instance = null;
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

    async getUserByEmail(email) {
        try {
            const query = 'SELECT * FROM users_list WHERE user_email = ?';
            const getUser = await new Promise((resolve,reject) => {
                connection.query(query,[email], (err, result) => {
                    if(err) {
                        reject(err);
                    }else {
                        resolve(result.length > 0);
                      }
                });
            });
            return getUser;
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
     
     //admin login

     async loginAdmin(email, password) {
        try {
            const query = 'SELECT * FROM admin_table WHERE admin_email = ? AND admin_password = ?';
            const loginUser = await new Promise((resolve,reject) => {
                connection.query(query,[email, password], (err, result) => {
                    if(err) {
                        reject(err);
                    }else {
                        if (result.length > 0) {
                            const storedPassword = result[0].admin_password;
                
                            // Compare the stored password with the provided password
                            if (storedPassword === password) {
                              resolve(true); // Passwords match, login successful
                            } else {
                              resolve(false); // Passwords do not match
                            }
                          } else {
                            resolve(false); // No user found with the given email
                          }
                        }
                });
            });
            return loginUser;
        } catch (error) {
            console.log(error);
        }
     }

     async confirmAttend(userId, attendedStatus) {
        try {
            const query = 'UPDATE users_list SET attend_status = ? WHERE user_id = ?';
            const confirmStatus = await new Promise((resolve, reject) => {
                connection.query(query, [attendedStatus, userId], (err, result) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
            return confirmStatus;
        } catch (error) {
            console.log(error);
        }
     }

     async selectAttendStatus() {
        try {
            const query = 'SELECT * FROM users_list';
            const select = await new Promise((resolve, reject) => {
                connection.query(query, (err, results) => {
                    if(err) {
                        reject(err);
                    } else {
                        const attendedData = {};
                        results.forEach(row => {
                            attendedData[row.user_id] = row.attend_status === '1';
                        });
                        resolve(attendedData);
                    }
                });
            });
            return select;
        } catch (error) {
            console.log(error);
        }
     }

     async getEventDetails() {
        try {
            const query = 'SELECT * FROM event_details';
            const getDetails = await new Promise((resolve, reject) => {
                connection.query(query, (err, result) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
            return getDetails;
        } catch (error) {
            console.log(error);
        }
     }


     async updateEventDetails(about_event, event_date, event_location ) {
        try {
            const query = 'UPDATE event_details SET about_event =? , event_date =? , event_location = ? WHERE detail_id = 1';
            const editDetail = await new Promise((resolve, reject) => {
                connection.query(query, [about_event, event_date, event_location ], (err, result) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
            return editDetail;
        } catch(error) {
            console.log(error);
        }
     }


     async addAdmin(name,email, password) {
        try {
            const query = 'INSERT INTO admin_table (admin_name, admin_email, admin_password) VALUES (?,?,?)'
            const newAdmin = await new Promise((resolve, reject) => {
                connection.query(query,[name,email,password] ,(err, result) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
            return newAdmin;
        } catch (error) {
            console.log(error);
        }
     }

     async adminList() {
        try {
            const query = 'SELECT * FROM admin_table';
            const selectAdmin = await new Promise((resolve, reject) => {
                connection.query(query, (err, result) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
            return selectAdmin;
        } catch (error) {
            console.log(error);
        }
     }

     async getOrganiserByEmail(email) {
        try {
            const query = 'SELECT * FROM admin_table WHERE admin_email = ?';
            const getUser = await new Promise((resolve,reject) => {
                connection.query(query,[email], (err, result) => {
                    if(err) {
                        reject(err);
                    }else {
                        resolve(result.length > 0);
                      }
                });
            });
            return getUser;
        } catch (error) {
            console.log(error);
        }
     }


     async deleteAdmin(admin_id) {
        try {
            const query = 'DELETE FROM admin_table WHERE admin_id = ?';
            const deleteUser = await  new Promise((resolve, reject) => {
                connection.query(query, [admin_id], (err, result) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
            return deleteUser;
        } catch (error) {
            console.log(error);
        }
     }

     //select users role 

     async combinedRoles() {
        try {
            const query =  `
            SELECT 'user_role' AS role, * FROM users_list
            UNION ALL
            SELECT 'organiser_role' AS role, * FROM admin_table;
          `;

          const combine = await new Promise((resolve, reject) => {
            connection.query(query, (err, result) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
          });
          return combine;
        } catch(error) {
            console.log(error);
        }
     }

    }
    module.exports = DbLearning;