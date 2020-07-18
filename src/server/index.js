// Setup empty JS object to act as endpoint for all routes
let projectData = {};
// Require Express to run server and routes
var path = require('path')
const express = require('express');
const app = express();


// Start up an instance of app

/* Middleware*/
const bodyParser = require('body-parser');

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());
// --------------Intialize the main project folder------------
app.use(express.static('dist'))
console.log(__dirname)

app.get('/', function (req, res) {
     res.sendFile('dist/index.html')
    res.sendFile(path.resolve('src/client/views/index.html'))
})


const dotenv = require('dotenv');
dotenv.config();

// designates what port the app will listen to for incoming requests
app.listen(8084, function () {
    console.log('Example app listening on port 8084!')
})

//----------------GET route-------------------------------


 app.get('/travelApp', (req, res) => {
  res.send(projectData)
  console.log(projectData);
})
//----------------POST route-------------------------------

app.post('/travelApp', addPost);

function addPost(req, res) {
    const data = req.body;
  projectData['latitude'] = data['latitude'];
  projectData['longitude'] = data['longitude'];
  projectData['country'] = data['country'];
  projectData['max_temp'] = data['max_temp'];
  projectData['min_temp'] = data['min_temp'];
  projectData['description'] = data['description'];
  projectData['image'] = data['image'];
    res.send(projectData)
    console.log('POST')
    console.log(projectData)
}
//-----------------------------------------------------
module.exports = app;
