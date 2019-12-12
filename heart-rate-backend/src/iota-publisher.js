const Mam = require('@iota/mam');
const iotaConverter = require('@iota/converter');

const mode = 'restricted';
const secretKey = 'SECRETBIG'; // secret always upper case!
const provider = 'https://nodes.devnet.iota.org';
let mamState = Mam.init(provider);
console.log(Mam.getRoot(mamState));
mamState = Mam.changeMode(mamState, mode, secretKey);

function getRoot() {
  console.log(Mam.getRoot(mamState));
  return Mam.getRoot(mamState);
}

const publish = async data => {
  // Create MAM Payload - STRING OF TRYTES
  const trytes = iotaConverter.asciiToTrytes(JSON.stringify(data));
  const message = Mam.create(mamState, trytes);

  // Save new mamState
  mamState = message.state;

  // Attach the payload
  await Mam.attach(message.payload, message.address, 3, 9);

  return message.root
};

module.exports = {
  publish,
  getRoot,
};
