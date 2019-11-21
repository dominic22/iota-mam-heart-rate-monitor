import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch, useParams } from 'react-router-dom';
import { trytesToAscii } from '@iota/converter';
import Mam from '@iota/mam';

const mode = 'restricted';
const secretKey = 'SECRETBIG'; // secret always upper case!
const provider = 'https://nodes.devnet.iota.org';
let mamState = Mam.init(provider);

export default function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/:root">
            <Home/>
          </Route>
          <Route path="/about">
            <About/>
          </Route>
          <Route path="/dashboard">
            <Dashboard/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

// You can think of these components as "pages"
// in your app.
const logData = data => console.log('Fetched and parsed', JSON.parse(trytesToAscii(data)), '\n')

function Home() {
  const { root } = useParams();
  Mam.fetch(root, mode, secretKey, logData);

  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo"/>
      <p>
        Current root: {root}
      </p>
    </header>
  );
}

function About() {
  return (<div>
    <h2>About</h2>
  </div>)
}

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  );
}
