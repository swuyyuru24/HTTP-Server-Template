const express = require('express')
const app = express()
const port = 3000

function calculateSum(counter){
    var sum= 0;
    for( var i=0;i<=  counter;i++){
        sum=sum + i;
    }
    return sum;
}

function handleFirstRequest(req, res){
    var counter = req.query.counter;
    var calculatedSum = calculateSum(counter);
    var ans= " The sum is " + calculatedSum;
    res.send(ans)
}
function createUser(req, res){
    res.send("Hello World!")
}

app.get('/handleSum1', handleFirstRequest)

app.post('/createUser', createUser)
// Type http://localhost:3000/createUser in Postman with POST 
// request method to get the output

function started(){
    console.log(`Example app listening on port ${port}`)
}

app.listen(port, started) 
  