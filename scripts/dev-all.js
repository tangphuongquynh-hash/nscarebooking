#!/usr/bin/env node
const { spawn } = require('child_process');
const waitOn = require('wait-on');

function spawnProcess(command, args, opts = {}) {
  const p = spawn(command, args, { stdio: 'inherit', shell: true, ...opts });
  p.on('exit', (code) => {
    if (code !== 0) {
      console.error(`${command} exited with code ${code}`);
    }
  });
  return p;
}

console.log('Starting Vite (npm run dev)...');
const vite = spawnProcess('npm', ['run', 'dev']);

// Wait for TCP port 5173 to be ready
const opts = { resources: ['tcp:5173'], timeout: 120000 };
console.log('Waiting for tcp:5173 to become available (up to 120s)...');
waitOn(opts, (err) => {
  if (err) {
    console.error('Timed out waiting for port 5173:', err);
    process.exit(1);
  }
  console.log('Port 5173 is available — starting ZMP (npx zmp start)...');
  // Start zmp in the same terminal
  spawnProcess('npx', ['zmp', 'start']);
});
