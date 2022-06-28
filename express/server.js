'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios')
const router = express.Router();
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from Express.js!</h1>');
  res.end();
});
router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/', (req, res) => res.json({ postBody: req.body }));
router.post('/getLocation', (req, res) => location(req, res));
app.use(bodyParser.json());

function location(req, res) {
  console.log("dsaasdsdadsa", req.body)
  const options = {
    method: 'GET',
    url: `http://api.positionstack.com/v1/reverse?access_key=714f37a94f12ed154c1589c14619657a&query=${req.body.lat},${req.body.lng}`
  };
  axios.get(`http://api.positionstack.com/v1/reverse?access_key=714f37a94f12ed154c1589c14619657a&query=${req.body.lat},${req.body.lng}`)
    .then(response => {
      console.log("error", response)
      return res.status(200).send({ message: response.data})
    })
    .catch(err => {
      console.log("error", err)
      return res.status(400).send({ message: err })
    });
}

app.use('/netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
