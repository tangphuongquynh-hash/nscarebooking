#!/usr/bin/env node
const { spawn } = require('child_process');
const waitOn = require('wait-on');

let viteProc = null;
let zmpProc = null;

function spawnProcess(command, args, opts = {}) {
  const p = spawn(command, args, { stdio: 'inherit', shell: true, ...opts });
  p.on('exit', (code) => {
    if (code !== 0) {
      console.error(`${command} exited with code ${code}`);
    }
  });
  return p;
}

function cleanupAndExit(code = 0) {
  try {
    if (zmpProc && !zmpProc.killed) zmpProc.kill('SIGTERM');
    if (viteProc && !viteProc.killed) viteProc.kill('SIGTERM');
  } catch (e) {}
  process.exit(code);
}

process.on('SIGINT', () => cleanupAndExit(0));
process.on('SIGTERM', () => cleanupAndExit(0));
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception in dev-all:', err);
  cleanupAndExit(1);
});

console.log('Starting Vite (npm run dev)...');
viteProc = spawnProcess('npm', ['run', 'dev']);

// Wait for HTTP GET 5173 to be ready (more reliable than raw TCP)
const opts = { resources: ['http-get://localhost:5173/'], timeout: 120000 };
console.log('Waiting for http://localhost:5173/ to become available (up to 120s)...');
waitOn(opts, (err) => {
  if (err) {
    console.error('Timed out waiting for http://localhost:5173/:', err);
    cleanupAndExit(1);
    return;
  }
  console.log('5173 is responding — starting ZMP (npx zmp start)...');
  // Start zmp in the same terminal
  zmpProc = spawnProcess('npx', ['zmp', 'start']);
  zmpProc.on('exit', (code) => cleanupAndExit(code));
});
