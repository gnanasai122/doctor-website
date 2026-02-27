const { spawn } = require("child_process");

const children = [];
let shuttingDown = false;

const startProcess = (label, command, args) => {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: true,
  });

  child.on("exit", (code) => {
    if (shuttingDown) return;

    if (code !== 0) {
      console.error(`${label} exited with code ${code}. Stopping all dev processes.`);
      shutdown(code || 1);
    }
  });

  children.push(child);
};

const shutdown = (exitCode = 0) => {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill("SIGINT");
    }
  }

  setTimeout(() => process.exit(exitCode), 300);
};

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

startProcess("backend", "npm", ["run", "dev", "--prefix", "backend"]);
startProcess("frontend", "npm", ["run", "dev", "--prefix", "frontend"]);
