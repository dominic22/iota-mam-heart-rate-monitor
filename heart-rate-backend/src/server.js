const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');

const router = express.Router();

router.get('/', (req, res) => {
  const { heartRate } = req.query;
  if (heartRate) {
    // TODO send heart rate to tangle!
    console.log('send heart rate to tangle!', heartRate);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<h1>Sent heart rate to tangle ' + heartRate + ' .</h1>');
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
