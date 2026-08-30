module.exports = {
  apps: [
    {
      name: 'bank-api',
      cwd: '.',
      script: 'dist/src/main.js',
      watch: false,
      env: {
        NODE_ENV: 'production', //use secrets not from.env but from AWS Parameter store
        PORT: 3005,
      },
    },
  ],
};
