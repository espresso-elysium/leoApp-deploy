// // Import required modules
// const fs = require('fs');             // Node's built-in file system module
// const path = require('path');         // For handling file paths
// const rootDir = require('../util/path'); // Gets the root directory of the project

// // Define the path to the users.json file where we'll store user data
// const filePath = path.join(rootDir, 'data', 'users.json');

// /**
//  * Function to save a new user object to the users.json file.
//  * @param {Object} userObj - The new user object to save.
//  * @param {Function} callback - A callback function to call after saving.
//  */
// function saveUser(userObj, callback) {
//   // Step 1: Read the existing users.json file
//   fs.readFile(filePath, 'utf8', (err, data) => {
//     let users = []; // Initialize users array

//     // Step 2: If file read is successful and contains data
//     if (!err && data) {
//       try {
//         users = JSON.parse(data); // Parse JSON string into JS array
//       } catch (e) {
//         console.log("Corrupted JSON. Starting with empty list.");
//         // If parsing fails, keep users as empty array
//       }
//     }

//     // Step 3: Add the new user to the users array
//     users.push(userObj);

//     // Step 4: Write updated users array back to users.json
//     fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
//       if (err) {
//         // If there's an error writing the file, log it and return via callback
//         console.error("Error saving user:", err);
//         return callback(err);
//       }
//       // On success, call the callback with no error
//       callback(null);
//     });
//   });
// }

// // Export the saveUser function so it can be used in app.js
// module.exports = saveUser;






/// checking is email exist

// helpers/saveUser.js

const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const filePath = path.join(rootDir, 'data', 'users.json');

/**
 * Save user only if email is not already taken
 * @param {Object} userObj
 * @param {Function} callback - (error, alreadyExists)
 */
function saveUser(userObj, callback) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    let users = [];

    if (!err && data) {
      try {
        users = JSON.parse(data);
      } catch (e) {
        console.log("Corrupted JSON. Starting fresh.");
      }
    }

    // ✅ Check if email already exists
    const emailExists = users.find((user) => user.email === userObj.email);
    if (emailExists) {
      return callback(null, true); // second argument true = duplicate found
    }

    // Add new user
    users.push(userObj);

    fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        console.error("Error saving user:", err);
        return callback(err, false);
      }
      callback(null, false); // no error, not a duplicate
    });
  });
}

module.exports = saveUser;
