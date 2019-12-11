var express = require('express');

const port = 8081;
const app = express();

app.get('/', function (req, res) {
  const { heartRate } = req.query;
  if (heartRate) {
    // TODO send heart rate to tangle!
    console.log('send heart rate to tangle!', heartRate);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<h1>Sent heart rate to tangle ' + heartRate + ' .</h1>');
    res.end();
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<h1>No heart rate received. Please add query parameter heartRate to your request.</h1>');
    res.end();
  }
});

app.listen(port, () => {
  console.log('app is running on port ', port);
});
