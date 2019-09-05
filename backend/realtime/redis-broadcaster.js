/*
 * A simple client manager that broadcasts Redis messages to all
 * connected websocket clients.
 */
const redis = require('redis');
const io = require('../realtime/').getIO();

// -------
const redisClient = redis.createClient();

const { authRedisChannel, voteRedisChannel } = require('./channels');

redisClient.subscribe(authRedisChannel);
redisClient.psubscribe(`${voteRedisChannel}*`);

// -------
redisClient.on('message', (channel, message) => {
  if (channel === authRedisChannel) {
    // write code to turn message from Redis into message you want to send to the client.
    let data = message.split(' ');
    const type = data[0];
    io.of('/auth').emit(type, { data: data.slice(1) });
    return;
  }
});

// redisClient.on("pmessage", (pchannel, channel, message) => {
//     if (channel.startsWith(voteRedisChannel)) {
//         // write code to turn message from Redis into message you want to send to the client.
//         const qid = ... // extract qid from channel on which message is sent
//         // write code to extract message
//         io.of("/votes").to(qid).emit('voteupdate', { ... message goes here });
//         return;
//     }
// });

io.of('/votes').on('connection', client => {
  // subscribe { qid: ... }  subscribe to vote updates for a question
  client.on('subscribe', msg => {
    client.join(msg.qid);
  });
  // unsubscribe { qid: ... }  unsubscribe from vote updates for a question
  client.on('unsubscribe', msg => {
    client.leave(msg.qid);
  });
});

// exports a 'shutdown' method (if needed)
module.exports = {
  shutdown: () => {
    redisClient.quit();
  }
};
