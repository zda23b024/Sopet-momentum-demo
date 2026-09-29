module.exports = {
  apps: [
    {
      name: 'sopet-backend',
      script: './backend/dist/src/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 4000,
      },
      max_memory_restart: '500M',
      error_file: './logs/backend-err.log',
      out_file: './logs/backend-out.log',
      merge_logs: true,
      time: true,
    },
  ],
};
