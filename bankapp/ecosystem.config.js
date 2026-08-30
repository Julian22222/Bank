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
          "https://s4ydb64kcg.execute-api.us-east-1.amazonaws.com",
      },
    },
  ],
};

//.env.production for build, doen't know your NEXT_PUBLIC_BACK_END_URL:
// export NEXT_PUBLIC_BACK_END_URL=https://s4ydb64kcg.execute-api.us-east-1.amazonaws.com

// rm -rf .next  //<--delete file .next
// npm run build
// pm2 restart bankapp
