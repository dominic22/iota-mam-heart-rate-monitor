import React, { useState } from 'react';
import logo from './logo.png';
import './App.css';
import { asciiToTrytes } from '@iota/converter';
import Mam from '@iota/mam';

const mode = 'restricted';
const secretKey = 'SECRETBIG'; // secret always upper case!
const provider = 'https://nodes.devnet.iota.org';
const explorerLink = `https://heart-rate-monitor.netlify.com/`;

let mamState = Mam.init(provider);
const baseRoot = Mam.getRoot(mamState);
mamState = Mam.changeMode(mamState, mode, secretKey);

const publish = async data => {
  // Create MAM Payload - STRING OF TRYTES
  const trytes = asciiToTrytes(JSON.stringify(data));
  const message = Mam.create(mamState, trytes);

  // Save new mamState
  mamState = message.state;

  // Attach the payload
  await Mam.attach(message.payload, message.address, 3, 9);

  return message.root
};

function App() {
  const [currentRoot, setCurrentRoot] = useState('');
  const [heartRate, setHeartRate] = useState(0);

  return (
    <div className="app">
      <header className="app-header">
        <img src={logo} className="app-logo" alt="logo"/>
        <div>Publish your heart rate to the tangle!</div>
        <div className="button" onClick={async () => {
          const heartRate = Math.ceil(Math.random(100) * 100);
          const root = await publish({
            heartRate: heartRate,
            timestamp: new Date().toISOString(),
          });
          setCurrentRoot(root);
          setHeartRate(heartRate);
        }}>Publish your heart rate
        </div>
        <div className="link-wrapper">Base root: <a
          className="app-link"
          href={explorerLink + baseRoot}
          target="_blank"
          rel="noopener noreferrer"
        > {baseRoot}</a></div>

        <div>Current heart rate: {heartRate}</div>
        <div className="link-wrapper">Current root: <a
          className="app-link"
          href={explorerLink + currentRoot}
          target="_blank"
          rel="noopener noreferrer"
        ><span> {currentRoot}</span></a></div>
      </header>
    </div>
  );
}

export default App;
