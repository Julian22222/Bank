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
        NODE_ENV: "production", //use secrets not from.env but from AWS Parameter strre
        PORT: 3005,
      },
    },
    {
      name: "bankapp",
      cwd: "./bankapp",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        NEXT_PUBLIC_BACK_END_URL:
          "http://ec2-108-129-233-222.eu-west-1.compute.amazonaws.com/api/",
      },
      watch: false,
    },
  ],
};
