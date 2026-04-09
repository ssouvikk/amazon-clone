import { registerAs } from '@nestjs/config';

export default registerAs('cache', () => ({
  ttl: parseInt(process.env['CACHE_TTL'] || '60000', 10),
  max: parseInt(process.env['CACHE_MAX'] || '100', 10),
  redis: {
    useRedis: process.env['USE_REDIS'] === 'true',
    host: process.env['REDIS_HOST'] || 'localhost',
    port: parseInt(process.env['REDIS_PORT'] || '6379', 10),
    ttl: parseInt(process.env['CACHE_TTL'] || '60000', 10),
  },
}));
