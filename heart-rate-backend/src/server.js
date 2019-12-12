const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const iotaPublisher = require('./iota-publisher');

const router = express.Router();

router.get('/', async (req, res) => {
  let { heartRate } = req.query;
  heartRate = Number(heartRate);
  if (heartRate && !isNaN(heartRate)) {
    console.log('send heart rate to tangle!', heartRate);
    const root = await iotaPublisher.publish({
      heartRate,
      timestamp: new Date().toISOString(),
    });
    console.log('new root: ', root);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<h1>Sent heart rate to tangle ' + heartRate + ' .</h1><p>Current root: ' + root + ' </p>');
    res.end();
  } else {
    console.log('no heart rate parameter provided');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<p>No heart rate received. Please add query parameter heartRate to your request.</p>' +
      '<p>You might have to call the url as domain.com/.netlify/functions/server?heartRate=53</p>');
    res.end();
  }
});

router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/', (req, res) => res.json({ postBody: req.body }));

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
