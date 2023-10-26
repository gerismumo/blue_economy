const xlsx = require('xlsx');
const connection = require('../database/config');

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
                        reject(err);
                    }
                    resolve(result);
                });
            });
            return addUser;
        } catch (error) {
            throw(error);
        }
    }

    async addUsersCyber (requestData) {
        try {
            const query ='INSERT INTO cybersecurity_list (first_name,last_name,full_name, email, portifolio_url, submitted_project, project_url, city, state, country, project_count, college_uni, job_speciality, registered_at, team_mates, heard_where, county, phone_number) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP,?,?,?,?)';
                const values = [
                    requestData.firstname,
                    requestData.lastname,
                    requestData.fullname,
                    requestData.email,
                    requestData.portfolioUrl,
                    requestData.submitProject,
                    requestData.projectUrl,
                    requestData.city,
                    requestData.state,
                    requestData.country,
                    requestData.projectCount,
                    requestData.collegeUni,
                    requestData.jobSpecialty,
                    requestData.teamMates,
                    requestData.heardHack,
                    requestData.county,
                    requestData.phoneNumber,
                ]
            const addUser = await new Promise((resolve, reject) => {
                connection.query(query, values, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    // console.log(result);
                    resolve(result);

                });
            });
            return addUser;
        } catch (error) {
            throw(error);
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
                        if (result.length > 0) {
                            resolve(result[0]); 
                        } else {
                            resolve(null); 
                      }
                    }
                });
            });
            return getUser;
        } catch (error) {
            throw(error);
        }
     }

     async getUserByEmailCyber(email) {
        try {
            const query = 'SELECT * FROM cybersecurity_list WHERE email = ?';
            const getUser = await new Promise((resolve,reject) => {
                connection.query(query,[email], (err, result) => {
                    if(err) {
                        reject(err);
                    }else {
                        if (result.length > 0) {
                            resolve(result[0]); 
                        } else {
                            resolve(null); 
                      }
                      }
                });
            });
            return getUser;
        } catch (error) {
            throw(error);
        }
     }

     //select users email by id

     async getUserByUserId(user_id) {
        try {
            const query = 'SELECT * FROM users_list WHERE user_id = ?';

            const selectUser = await new Promise((resolve, reject) => {
                connection.query(query, [user_id], (err, result) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
            return selectUser;
        } catch (error) {
            throw(error);
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
            throw(error);
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
            throw(error);
        }
    }

    async deleteUserCyber(attendee_id) {
        try {
            const query = 'DELETE FROM cybersecurity_list WHERE attendee_id = ? '
            const deleteUser = await new Promise((resolve, reject) => {
                connection.query(query, [attendee_id], (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(result);
                });
            });
            return deleteUser;
        } catch (error) {
            throw(error);
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
            throw(error);
        }
     }

     async getAdminEmail(email) {
        try {
            const query = 'SELECT * FROM admin_table WHERE admin_email = ?';
            const getUser = await new Promise((resolve,reject) => {
                connection.query(query,[email], (err, result) => {
                    if(err) {
                        reject(err);
                    }else {
                        resolve(result.length > 0 ? result[0] : null);
                      }
                });
            });
            return getUser;
        } catch (error) {
            throw(error);
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
            throw(error);
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
            throw(error);
        }
     }

     async selectAttendStatusCyber() {
        try {
            const query = 'SELECT * FROM cybersecurity_list';
            const select = await new Promise((resolve, reject) => {
                connection.query(query, (err, results) => {
                    if(err) {
                        reject(err);
                    } else {
                        const attendedData = {};
                        results.forEach(row => {
                            attendedData[row.attendee_id] = row.attend_status === '1';
                        });
                        resolve(attendedData);
                    }
                });
            });
            return select;
        } catch (error) {
            throw(error);
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
            throw(error);
        }
     }


     async updateEventDetails(about_event, event_date,event_time, event_location ) {
        try {
            const query = 'UPDATE event_details SET about_event =? , event_date =? ,event_time =?, event_location = ? WHERE detail_id = 1';
            const editDetail = await new Promise((resolve, reject) => {
                connection.query(query, [about_event, event_date, event_time, event_location ], (err, result) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
            return editDetail;
        } catch(error) {
            throw(error);
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
            throw(error);
        }
     }

     async adminList() {
        try {
            const query = "SELECT * FROM admin_table";
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
            throw(error);
        }
     }

     async organisersList() {
        try {
            const query = `SELECT * FROM admin_table WHERE organiser_role = 'organiser'`;
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
            throw(error);
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
            throw(error);
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
            throw(error);
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
            throw(error);
        }
     }

     //file upload
     async fileUpload(jsonData) {
        try {
            if (Array.isArray(jsonData)) {
              
                const valuesToInsert = jsonData.map(item => {
                  return [
                    item['Email Address'],
                    item['Full Names'],
                    item['Designation/Occupation/Role'],
                    item['Company/ Organization Name'],
                    item['Phone number(For communication purposes only)'],
                    item['Which industry are you in?'],
                    item['How did you hear about the event?'],
                    item["Did you attend last year's Blue Economy Summit?"],
                    item['Which areas are of interest to you during the summit?'],
                    item['Do you consent joining our mailing list to receive our newsletter?'],
                    item["How will you be joining this year's summit?"],
                    item['Describe your product or the services that you offer?'],
                    item['Which category do you fall in?']
                  ];
                });
                const query = 'INSERT INTO users_list (user_email,user_name,occupation, company, phone_number, industry_in, hear_about_event, attend_last_year, user_interest, join_newsletter, join_as, describe_product, category_fall) VALUES ?';

                connection.query(query, [valuesToInsert], (err, results) => {
                    if(err) {
                        console.error('Error inserting data: ' + err.message);
                    } else {
                        console.log('Data inserted successfully.');
                    }
                })
            } else {
                throw new Error;
            }
        } catch (error) {
            throw(error);
        }
     }

    //  async selectUserByEmail() {
    //     try {
    //         const query = 'SELECT * FROM users_list WHERE user_email = ?';
    //         const selectUser = await new Promise((resolve, reject) => {
    //             connection.query(query, (err, result) => {
    //                 if(err) {
    //                     reject(err);
    //                 } else {
    //                     resolve(result);
    //                 }
    //             });
    //         });
    //         return selectUser;
    //     } catch (error) {
    //         throw(error);
    //     }
    //  }

     async fileUploadCyber(jsonData) {
        try {
            if (Array.isArray(jsonData)) {
              
                const valuesToInsert = jsonData.map(item => {
                  return [
                    item['First Name'],
                    item['Last Name'],
                    item['Full Name'],
                    item['Email'],
                    item['Portfolio Url'],
                    item['Submitted Project?'],
                    item['Project URLs'],
                    item['City'],
                    item['State'],
                    item['Country'],
                    item['Project Count'],
                    item['College/University Name'],
                    item["Job Specialty"],
                    item['Registered At'],
                    item['Do you have teammates?'],
                    item['Who told you about this hackathon?'],
                    item['County of Residence'],
                    item['Phone number( For communication purposes only)']
                  ];
                });
                const query = 'INSERT INTO cybersecurity_list (first_name,last_name,full_name, email, portifolio_url, submitted_project, project_url, city, state, country, project_count, college_uni, job_speciality,registered_at ,team_mates, heard_where, county, phone_number) VALUES ?';

                connection.query(query, [valuesToInsert], (err, results) => {
                    if(err) {
                        console.error('Error inserting data: ' + err.message);
                    } else {
                        console.log('Data inserted successfully.');
                    }
                })
            } else {
                throw Error;
            }
        } catch (error) {
            console.log(error);
        }
     }

     async cyberSecurityList() {
        try{
            const query = 'SELECT * FROM cybersecurity_list';
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
            throw(error);
        }
    }

    async getUserByUserIdCyber(attendee_id) {
        try {
            const query = 'SELECT * FROM cybersecurity_list WHERE attendee_id = ?';

            const selectUser = await new Promise((resolve, reject) => {
                connection.query(query, [attendee_id], (err, result) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
            return selectUser;
        } catch (error) {
            throw(error);
        }
     }

     async confirmAttendCyber(userId, attendedStatus) {
        try {
            const query = 'UPDATE cybersecurity_list SET attend_status = ? WHERE attendee_id = ?';
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
            throw(error);
        }
     }

     async updateAttendStatus(email) {
        const query = 'UPDATE users_list SET attend_status = 1 WHERE user_email = ?';
        return new Promise((resolve, reject) => {
            connection.query(query, [email], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    async updateAttendStatusCyber(email) {
        const query = 'UPDATE  cybersecurity_list SET attend_status = 1 WHERE email = ?';
        return new Promise((resolve, reject) => {
            connection.query(query, [email], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
     
    }
    module.exports = DbLearning;