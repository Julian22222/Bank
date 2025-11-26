# PM2 in Next.js and NestJS

To run project from main file if you have this structure:

```JS
/bank-app
      -/bank-api (back-end - NestJS)
      -/bankapp (Front-end - Next.js)
```

- PM2 must run an actual file/command, not an npm script name (npx pm2 start dev, for example)

```JS
pm2 start ecosystem.config.js //simply tells PM2: --> “Load everything listed in this config file and run all apps inside it.”

//OR

pm2 start ecosystem.config.js --watch   //<-- run files in "dev mode" with logging and auto-restart

npx pm2 stop all  //<-- Stop all running PM2 processes
```

```JS
//ecosystem.config.js file

module.exports = {
  apps: [
    {
      name: "bank-api",        // Name of process in PM2, This is just a name. PM2 will show this name in the list of running processes.
      cwd: "./bank-api",       // Path to folder, This means -> Before running anything, go into the bank-api folder (like doing --> cd bank-api)
      script: "npm",           // Program PM2 will execute, PM2 needs to know what program to run. Here you tell PM2: “Run the npm program.” Just like typing npm in your terminal.
      args: "run start:dev",   // Arguments passed to npm (npm run start:dev). These are the arguments you pass to npm. This is the same as typing: "npm run start:dev". So PM2 will run your NestJS dev server.
      watch: false    //tells PM2 not to automatically restart the app when files change
      //You change a file → Nothing happens → You must restart manually
      //PM2 does nothing.--> You must manually restart the app if you want changes to take effect.
      //On production - watch: false servers (recommended)
      //Use - watch: true , During development, When you want PM2 to auto-reload like Nodemon
    },
    {
      name: "bankapp",
      cwd: "./bankapp",
      script: "npm",
      args: "run dev",         // Next.js dev server
      watch: true     //PM2 watches the folder, If you edit a file (e.g., a .ts or .js file), PM2 restarts the app automatically.
    }
  ]
};


⭐ In one short sentence:

PM2 goes into the bank-api folder, runs npm run start:dev, names this process “bank-api”, and manages it for you.
```

🔥 What happens when you run:

```JS
pm2 start ecosystem.config.js
```

PM2 reads the file and starts BOTH apps:

1. Go into ./bank-api folder
2. Run: npm run start:dev (NestJS)
3. Go into ./bankapp folder
4. Run: npm run dev (Next.js)

Both run in parallel, managed by PM2.

🔎 Why this works

PM2 supports running multiple apps by listing them inside the apps array.

Every app definition tells PM2:

- which directory (cwd)
- which runtime to use (script)
- what to run (args)
- what its name should be (name)

```JS
//PM2 commands

- npx pm2 start server.js // <-- It downloads PM2 temporarily and starts your Node.js server (server.js) as a managed process
- npx pm2 stop 0 //<-- Stops the PM2-managed process with the ID 0. The ID corresponds to the process number shown in pm2 list
- npx pm2 monit 0 //<-- Opens a real-time monitoring dashboard for the process with ID 0. Shows CPU, memory, event loop delay, and other performance metrics
- npx pm2 list //<-- Displays a table of all running PM2 processes with their IDs, names, status, CPU and memory usage
- npx pm2 logs //<-- Shows live logs for all managed processes, helping you debug or monitor output
- npx pm2 restart <id or name>
- npx pm2 delete <id or name>
- npx pm2 reload <id or name>
- npx pm2 stop all  //<-- Stop all running PM2 processes
- pm2 stop app.js  //<-- Stop app.js file only
- npx pm2 restart all //<-- Restart all running processes
- npx pm2 delete all //<-- Stop and remove all processes
- npx pm2 flush //<-- Clear all logs
- npx pm2 logs <id or name>
- npx pm2 save //<-- Save current process list to be resurrected on reboot
```
