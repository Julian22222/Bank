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
        NEXT_PUBLIC_BACK_END_URL:
          // "http://ec2-108-129-233-222.eu-west-1.compute.amazonaws.com/api",
          "https://s4ydb64kcg.execute-api.us-east-1.amazonaws.com/",
      },
    },
  ],
};

// NEXT_PUBLIC_BACK_END_URL=https://abc123xyz.execute-api.eu-west-1.amazonaws.com

// rm -rf .next
// npm run build
// pm2 restart bankapp
