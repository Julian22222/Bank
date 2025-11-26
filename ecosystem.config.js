module.exports = {
  apps: [
    {
      name: "bank-api",
      cwd: "./bank-api",
      script: "npm",
      args: "run start:dev",
      watch: true,
    },
    {
      name: "bankapp",
      cwd: "./bankapp",
      script: "npm",
      args: "run dev",
      watch: true,
    },
  ],
};
