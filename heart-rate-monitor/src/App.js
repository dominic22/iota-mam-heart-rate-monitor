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
            <Home/>
          </Route>
          <Route exact path="/:root">
            <StaticRoot/>
          </Route>
        </Switch>
      </header>
    </Router>
  );
}

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
  let fetched = null;
  if (root) {
    fetched = await Mam.fetch(root, mode, secretKey, logData);
  }
  const nextRoot = fetched && fetched.nextRoot;

  console.log('Next Root: ', nextRoot);
  if (nextRoot == null) {
    const root = await syncData();
    console.log('synced root: ', root);
    await pullTangleData(root);
  } else {
    setTimeout(async () => {
      await pullTangleData(nextRoot);
    }, 2000);
  }
}

async function initView() {
  const syncedRoot = await syncData();
  if (syncedRoot) {
    await pullTangleData(syncedRoot);
    return true;
  } else {
    console.error('Didn\'t find any rout');
    return false;
  }
}

async function syncData() {
  console.log('sync data');
  const urlPrefix = process.env.NODE_ENV === 'production' ? 'https://heart-rate-backend.netlify.com' : '';

  let responsePromise = fetch(urlPrefix + '/.netlify/functions/server?currentRootParam=true');
  const response = await responsePromise;
  console.log('response', response);
  if (response.status === 200) {
    try {
      const json = await response.json();
      console.log('current root', json.currentRoot);
      return json.currentRoot;
    } catch (e) {
      console.log('Error: ', e);
    }
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
            const root = await syncData();
            console.log('synced root: ', root);
            await pullTangleData(root);
          }}>SYNC CHART
          </div>
        </div>
      </div>

      <ChartViewComponent data={[]} labels={[]}/>
    </>
  );
}

async function pullTangleDataStatic(root) {
  const fetched = await Mam.fetch(root, mode, secretKey, logData);
  const nextRoot = fetched.nextRoot;
  console.log('Next Root: ', nextRoot);
  setTimeout(async () => {
    await pullTangleDataStatic(nextRoot);
  }, 500);
}


function StaticRoot() {
  const { root } = useParams();
  pullTangleDataStatic(root);

  return (
    <>
      <div className="headline-container">
        <img src={logo} className="app-logo" alt="logo"/>
        <h1>Heart Rate Monitor</h1>
      </div>
      <ChartViewComponent data={[]} labels={[]}/>
    </>
  );
}
