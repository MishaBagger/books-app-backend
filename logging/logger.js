const fs = require('fs');
const path = require('path');
const winston = require('winston');
const { combine, timestamp, json } = winston.format;

const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logger = winston.createLogger({
  level: 'error',
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.File({ 
      filename: path.join(logsDir, 'errors.log'),
      maxsize: 1024 * 1024,
      maxFiles: 3
    }),
  ]
});

module.exports = logger