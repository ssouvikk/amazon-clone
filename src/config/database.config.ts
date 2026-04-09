import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  uri: process.env['MONGO_URI'],
  retryAttempts: 5,
  retryDelay: 3000,
}));
