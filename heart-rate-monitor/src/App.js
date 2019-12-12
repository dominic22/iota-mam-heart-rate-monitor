import React from 'react';
import logo from './logo.png';
import ChartViewComponent, { addData } from './chart/Chart'
import './App.css';
import { BrowserRouter as Router, Route, Switch, useParams } from 'react-router-dom';
import { trytesToAscii } from '@iota/converter';
import Mam from '@iota/mam';
import moment from 'moment';
import 'moment/locale/de';

const mode = 'restricted';
const secretKey = 'SECRETBIG'; // secret always upper case!
const provider = 'https://nodes.devnet.iota.org';
Mam.init(provider);

export default function App() {
  return (
    <Router>
      <header className="app-header">
        <Switch>
          <Route exact path="/">
            <header className="app-header">
              <p>You have not specified a root. Please call the URL as following: localhost:3001/ROOT</p>
            </header>
          </Route>
          <Route exact path="/:root">
            <Home/>
          </Route>
        </Switch>
      </header>
    </Router>
  );
}

let nextRoot = null;

// You can think of these components as "pages"
// in your app.
const logData = encodedData => {
  const data = JSON.parse(trytesToAscii(encodedData));
  console.log('Fetched and parsed', data, '\n')
  console.log('data ', data.heartRate)

  moment.locale('de');
  let dateString = moment(data.timestamp).format('LTS');

  // if (!prevDate || date.getDate() !== prevDate.getDate() || date.getMonth() !== prevDate.getMonth() || date.getFullYear() !== prevDate.getFullYear()) {
  //   dateString = moment(data.timestamp).format('MM.DD.YYYY');
  //   prevDate = date;
  // }
  const date = moment(data.timestamp).format('MM.DD.YYYY');

  addData(dateString, data.heartRate, date);
};

let counter = 0;

async function pullTangleData(root) {
  const fetched = await Mam.fetch(root, mode, secretKey, logData);
  nextRoot = fetched.nextRoot ? fetched.nextRoot : nextRoot;
  console.log('Next Root: ', nextRoot);
  console.log('Next Root: ', fetched.messages);
  if (fetched.messages && fetched.messages.length > 0) {
    const lastMessage = fetched.messages[fetched.messages.length - 1];
    console.log('LAST MESSAGE ', lastMessage);
    const data = JSON.parse(trytesToAscii(lastMessage));
    console.log('LAST MESSAGE DECODED', data);
  }

  if (counter === 100) {
    counter = 0;
    Mam.init(provider);
  }

  setTimeout(() => {
    counter++;
    pullTangleData(nextRoot);
  }, 2000);
}

function Home() {
  const { root } = useParams();
  pullTangleData(root);

  return (
    <>
      <div className="headline-container">
        <img src={logo} className="app-logo" alt="logo"/>
        <div className="headline-wrapper">
          <h1>Heart Rate Monitor</h1>
          <div className="button" onClick={async () => {
            console.log('SYNC')
            const urlPrefix = process.env.NODE_ENV === 'production' ? 'https://heart-rate-backend.netlify.com' : '';

            let responsePromise = fetch(urlPrefix + '/.netlify/functions/server/currentroot');
            const response = await responsePromise
            if (response.status === 200) {
              const json = await response.json();
              nextRoot = json.currentRoot;
            } else {
              console.log('fetched failed');
            }
          }}>SYNC CHART
          </div>
        </div>

      </div>


      <ChartViewComponent data={[]} labels={[]}/>
    </>
  );
}
