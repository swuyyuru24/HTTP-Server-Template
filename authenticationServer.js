/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with username, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the username already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with username and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users username and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

const express = require("express")
const PORT = 3000;
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

app.use(bodyParser.json());

function generateRandomNumber() {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}

function UserSignup(req,res){
  let username = req.body.username;
  let email = req.body.email;

  console.log(username);
  console.log(email);

  fs.readFile("users.json", 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('File reading error');
    }

    const users = JSON.parse(data);
    let newUser;
    
    for (let i = 0; i < users.length; i++) {
      if (users[i].username === username && users[i].email === email) {
        return res.status(400).send('Account already exists'); // User already exists
      }
    }

    newUser= req.body;
    id = generateRandomNumber();
    newUser.userId = id.toString();
    users.push(newUser);
    const updatedData = JSON.stringify(users);

    // Write the updated JSON string back to the file
    fs.writeFile('users.json', updatedData, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error writing the file:', writeErr);
        return;
      }
      console.log('New user added successfully');
      res.status(200).send("Created new user successfully");
    });
  });
}

function UserLogin(req,res){

  const username = req.query.username;
  const password = req.query.password

  fs.readFile("users.json", 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('File reading error');
    }
  
    const users = JSON.parse(data);
    let user;

    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username && users[i].password === password) {
            user = users[i];
            break;
        }
    }
    if (!user) {
      return res.status(404).send('No user with given credentials found'); // if user not found, return
    }

    // Return the user Found to the server
    const userDetails ={
      firstname : user.firstname,
      lastname : user.lastname,
      userId : user.userId
    };

    return res.status(200).send(userDetails);
  });  
}

function GetDataofUsers(req, res){

  const username = req.query.username;
  const password = req.query.password

  fs.readFile("users.json", 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('File reading error');
    }
  
    const users = JSON.parse(data);
    let user;

    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username && users[i].password === password) {
            user = users[i];
            break;
        }
    }
    if (!user) {
      return res.status(404).send('No user with given credentials found'); // if user not found, return
    }

    // Return the user details to the server for authorized server
    const userMap = {};
    users.forEach(user => {
      userMap[user.userId] = {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      };
    });

    return res.status(200).json(userMap);
  });  

}

app.post('/signup', UserSignup)
app.post('/login',UserLogin)
app.get('/data',GetDataofUsers)
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

// Handling undefined URL routes with 404 error
app.use((req, res, next) => {
  res.status(404).send('<h1> Error 404: Not Found </h1>');
});

function started(){
  console.log(`Authentication Server app listening on port ${PORT}`)
}
app.listen(PORT, started) 
module.exports = app;
