module.exports = {
  apps: [
    {
      name: 'bank-api',
      cwd: '.',
      script: 'dist/src/main.js',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3005,
      },
    },
  ],
};
