Dev: Run Vite then ZMP (two-tab flow)

Use this quick guide when you want to run the app in the Zalo simulator with a simple two-tab workflow.

1) Tab A — start Vite (front-end dev server)

Run:

cd /path/to/frontend
npm install   # only if you haven't installed deps
npm run dev

Wait until Vite prints a ready message like:

  VITE vX.Y.Z  ready in ...

and shows a Local URL: http://localhost:5173/ (or another port if 5173 is busy).

2) Tab B — start ZMP (simulator)

After Vite is ready, in a new terminal tab run:

cd /path/to/frontend
npm run zdev

ZMP will start a local UI (NW.js) that proxies to Vite and loads your app inside the Zalo frame.

Stopping / clean restart

- If both are running in the same terminal, press Ctrl+C to stop them.
- If you closed the terminal or a process is stuck, find and kill by port or PID:

lsof -iTCP -sTCP:LISTEN -P -n | grep -E "5173|5174|3000|2999"

# kill by PID (example)
kill <PID>
kill -9 <PID>  # if needed

Notes & troubleshooting

- If Vite falls back to another port (e.g. 5174) update the URL when starting ZMP or just run `npm run zdev` after Vite is ready — ZMP will try to detect the running port.
- If ZMP shows `errorpage.html`, it means it couldn't reach the Vite dev server. Confirm Vite is running and reachable at the printed Local URL.

Enjoy fast dev iteration: edit code, save, and Vite will hot-reload; the simulator should reflect changes automatically.
