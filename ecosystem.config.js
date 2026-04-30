module.exports = {
  apps: [{
    name: 'rifasonline',
    script: 'npm',
    args: 'start',
    cwd: '/home/rifasonline/htdocs/whatsrifas.com.br/rifasonline',
    env: {
      NODE_ENV: 'production',
      PORT: 3088
    }
  }]
}
