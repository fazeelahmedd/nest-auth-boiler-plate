import { MESSAGES } from 'src/common/messages';
import { Tedis } from 'tedis';
const {
  REDIS: { CONNECTED, TIMEOUT, CLOSE_WITH_ERROR },
} = MESSAGES;
const client = new Tedis({
  port: 6379,
  host: '127.0.0.1',
});

client.on('connect', () => {
  console.log(CONNECTED);
});
client.on('timeout', () => {
  console.log(TIMEOUT);
});
client.on('error', (err) => {
  console.log(err);
});
client.on('close', (had_error) => {
  console.log(CLOSE_WITH_ERROR, had_error);
});

export default client;
