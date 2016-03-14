'use strict';

const cp = require('child_process');
const path = require('path');
const debug = require('debug');
const watch = require('node-watch');

let server;
let online = false;

const SERVER = path.resolve(__dirname, '../../server/index');

function startServer() {
  debug('dev')('starting express server');
  const env = Object.create(process.env);
  env.NODE_ENV = 'development';
  env.BABEL_ENV = 'server';
  server = cp.fork(SERVER, { env });

  server.once('message', (message) => {
    if (message === 'online' && !online) {
      debug('dev')('express server started');
      online = true;
    }
  });
}

function restartServer() {
  if (online) {
    debug('dev')('restarting express server');
    server.kill('SIGTERM');
    return startServer();
  }
}

// Listen for `rs` in stdin to restart server
debug('dev')('type `rs` in console to restart express server');
process.stdin.setEncoding('utf8');
process.stdin.on('data', (data) => {
  const parsedData = (`${data}`).trim().toLowerCase();

  if (parsedData === 'rs') {
    return restartServer();
  }
});

// Start watch on server files
// and reload browser on changes
watch(
  path.resolve(__dirname, '../../server'),
  file => !file.match('webpack-stats.json') && restartServer()
);

process.on('exit', () => server.kill('SIGTERM'));

module.exports = () => !server ? startServer() : () => ({});
