module.exports = {
  apps: [
    {
      name: 'rifasonline',
      script: 'server.js',
      cwd: '/home/rifasonline/htdocs/whatsrifas.com.br',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3088
      }
    }
  ]
}
