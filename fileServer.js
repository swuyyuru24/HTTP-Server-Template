/**
  You need to create an express HTTP server in Node.js which will handle the logic of a file server.
  - Use built in Node.js `fs` module

  The expected API endpoints are defined below,
  1. GET /files - Returns a list of files present in `./files/` directory
    Response: 200 OK with an array of file names in JSON format.
    Example: GET http://localhost:3000/files

  2. GET /file/:filename - Returns content of given file by name
     Description: Use the filename from the request path parameter to read the file from `./files/` directory
     Response: 200 OK with the file content as the response body if found, or 404 Not Found if not found. Should return `File not found` as text if file is not found
     Example: GET http://localhost:3000/file/example.txt

    - For any other route not defined in the server return 404

    Testing the server - run `npm run test-fileServer` command in terminal
 */
const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const app = express();
const port = 3000

async function readtheFile(filePath){
  try {
      return await fs.readFile(filePath, 'utf8');
  } catch (err) {
      throw new Error('File reading error');
  }
}

async function GetFileContents(req, res){
  try {
    const filename = req.params.filename;
    console.log(filename);
    const filePath = path.join('/Users/samyukthawuyyuru/Documents/iStudy/100XDev/week2/Week-2-Assignments-main/02-nodejs/files/', filename);
    console.log(filePath);
    const filecontent = await readtheFile(filePath);
    res.status(200).send(filecontent);
  } 
  catch (err) {
    res.status(500).send(err.message);
  }
}

async function GetListofFiles(req, res){
  const directoryPath = path.join('/Users/samyukthawuyyuru/Documents/iStudy/100XDev/week2/Week-2-Assignments-main/02-nodejs' , './files/');
  console.log(directoryPath)
  const files = await fs.readdir(directoryPath);
  res.status(200).send(files);
}

  
app.get('/files', GetListofFiles)
app.get('/file/:filename', GetFileContents)


// Handling undefined URL routes with 404 error
app.use((req, res, next) => {
  res.status(404).send('<h1> Error 404: Not Found </h1>');
});

function started(){
    console.log(`File Server app listening on port ${port}`)
}
app.listen(port, started) 

module.exports = app;
