const { createClient } = require('redis');
const fs = require('fs')

const redisClient = createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD,
  socket: {
    tls: true,
    ca: [fs.readFileSync('/etc/redis/redis.crt')]
  }
});

redisClient.on('error', (err) => {
  console.error('Redis ошибка: ', err);
});

(async () => {
  try {
    await redisClient.connect();
    console.log('Подключен к Redis');
  } catch (err) {
    console.error('Redis подключение провалилось: ', err);
  }
})();

module.exports = redisClient;