module.exports = {
  apps: [
    {
      name: 'p2p-sunset',
      script: './sunset.js',
      instances: 1,
      exec_mode: 'fork', // Use 'fork' for Socket.IO apps
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env_production: {
        NODE_ENV: 'production',
        SOCKET_PATH: '/tmp/p2p-sunset.sock'
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 8075
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      min_uptime: '10s',
      max_restarts: 10,
      kill_timeout: 5000,
      wait_ready: false,
      listen_timeout: 10000
    }
  ]
};
