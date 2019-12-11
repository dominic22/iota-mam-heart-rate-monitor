var express = require('express');

const port = 8081;
const app = express();

app.get('/', function (req, res) {
  const { heartRate } = req.query;
  if (heartRate) {
    // TODO send heart rate to tangle!
    console.log('send heart rate to tangle!', heartRate);
    res.send('send heart rate to tangle!', heartRate);
  } else {
    res.send('No heart rate received. Please add query parameter heartRate to your request.');
  }
});

app.listen(port, () => {
  console.log('app is running on port ', port);
});
