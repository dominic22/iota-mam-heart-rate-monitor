const port = 8081;

const app = require('./server');

app.listen(port, () => {
  console.log('app is running on port ', port);
});
