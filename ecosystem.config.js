// PM2 process definition used on the EC2 instance.
// `pm2 start ecosystem.config.js` runs the backend in production mode; the backend
// also serves the built React frontend, so a single process serves the whole app.
module.exports = {
  apps: [
    {
      name: 'medication-reminder-system',
      cwd: './backend',
      script: 'server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 5001,
        MONGO_URI: 'mongodb://127.0.0.1:27017/medication-reminder',
        // JWT_SECRET is provided on the server via the backend/.env file (not committed).
      },
    },
  ],
};
