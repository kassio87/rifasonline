module.exports = {
  apps: [{
    name: 'rifasonline',
    script: 'npm',
    args: 'start',
    cwd: '/home/rifasonline/htdocs/whatsrifas.com.br/rifasonline',
    error_file: '/home/rifasonline/htdocs/whatsrifas.com.br/rifasonline/logs/error.log',
    out_file: '/home/rifasonline/htdocs/whatsrifas.com.br/rifasonline/logs/out.log',
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
