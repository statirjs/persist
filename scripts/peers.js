const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PACKAGE_PATH = '../package.json';

const PEERS = ['@statirjs/core'];

function logger(error) {
  error && console.log(error);
}

function install(peer) {
  const command = `npm i -D ${peer}`;
  execSync(command, logger);
}

function filterDevDependencies(devDependencies) {
  return Object.keys(devDependencies)
    .filter((key) => !PEERS.includes(key))
    .map((key) => [key, devDependencies[key]])
    .reduce(
      (acc, [key, data]) => ({
        ...acc,
        [key]: data
      }),
      {}
    );
}

function filterPeerDependencies(devDependencies) {
  return Object.keys(devDependencies)
    .filter((key) => PEERS.includes(key))
    .map((key) => [key, devDependencies[key]])
    .reduce(
      (acc, [key, data]) => ({
        ...acc,
        [key]: data
      }),
      {}
    );
}

function updatePackage() {
  const package = require(PACKAGE_PATH);
  const { devDependencies } = package;
  const dev = filterDevDependencies(devDependencies);
  const peer = filterPeerDependencies(devDependencies);

  const nextPackage = {
    ...package,
    devDependencies: dev,
    peerDependencies: peer
  };

  const data = JSON.stringify(nextPackage);
  const packagePath = path.resolve(__dirname, PACKAGE_PATH);
  fs.writeFileSync(packagePath, data, 'utf-8');
}

function main() {
  PEERS.forEach(install);
  updatePackage();
}

main();
