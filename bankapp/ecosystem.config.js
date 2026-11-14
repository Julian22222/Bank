module.exports = {
  apps: [
    {
      name: "bankapp",
      cwd: ".",
      script: "npm",
      args: "start",
      watch: false,
      env: {
        NODE_ENV: "production",
        BACK_END_URL:
          // "http://ec2-108-129-233-222.eu-west-1.compute.amazonaws.com/api",
          "https://s4ydb64kcg.execute-api.us-east-1.amazonaws.com",
      },
    },
  ],
};
