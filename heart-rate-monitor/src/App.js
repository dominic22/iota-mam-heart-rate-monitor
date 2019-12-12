import React from 'react';
import logo from './logo.png';
import ChartViewComponent, { addData } from './chart/Chart'
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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
            <Home/>
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

  const date = moment(data.timestamp).format('MM.DD.YYYY');
  if (data.heartRate != null && data.heartRate >= 0) {
    addData(dateString, data.heartRate, date);
  }
};

async function pullTangleData(root) {
  const fetched = await Mam.fetch(root, mode, secretKey, logData);
  nextRoot = fetched.nextRoot ? fetched.nextRoot : nextRoot;
  console.log('Next Root: ', nextRoot);

  setTimeout(() => {
    pullTangleData(nextRoot);
  }, 2000);
}

async function initView() {
  const syncedRoot = await syncData();
  if (syncedRoot) {
    pullTangleData(syncedRoot);
    return true;
  } else {
    console.error('Didn\'t find any rout');
    return false;
  }
}

async function syncData() {
  console.log('sync data');
  const urlPrefix = process.env.NODE_ENV === 'production' ? 'https://heart-rate-backend.netlify.com' : '';

  let responsePromise = fetch(urlPrefix + '/.netlify/functions/server/currentroot');
  const response = await responsePromise;
  if (response.status === 200) {
    const json = await response.json();
    console.log('current root', json.currentRoot);
    return json.currentRoot;
  } else {
    console.log('fetched failed');
    return null;
  }
}

function Home() {
  const initialized = initView();
  if (!initialized) {
    return (<header className="app-header">
      <p>Couldn't fetch any route is the backend running?</p>
    </header>)
  }

  return (
    <>
      <div className="headline-container">
        <img src={logo} className="app-logo" alt="logo"/>
        <div className="headline-wrapper">
          <h1>Heart Rate Monitor</h1>
          <div className="button" onClick={async () => {
            syncData()
          }}>SYNC CHART
          </div>
        </div>

      </div>


      <ChartViewComponent data={[]} labels={[]}/>
    </>
  );
}
