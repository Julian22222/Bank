//Local development version:
// module.exports = {
//   apps: [
//     {
//       name: "bank-api",
//       cwd: "./bank-api",
//       script: "npm",
//       args: "run start:dev",
//       watch: true,
//     },
//     {
//       name: "bankapp",
//       cwd: "./bankapp",
//       script: "npm",
//       args: "run dev",
//       watch: true,
//     },
//   ],
// };

//Prod environment:
module.exports = {
  apps: [
    {
      name: "bank-api",
      cwd: "./bank-api",
      script: "dist/src/main.js",
      watch: false,
      env: {
        NODE_ENV: "production",
        USE_AWS_PARAMETER_STORE: "true", //use secrets not from.env but from AWS Parameter strre
        PORT: 3005,
      },
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
