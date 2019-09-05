import io from 'socket.io-client'; // uses stand-alone build
import EventEmitter from 'events';

// voting
import toast from '../ui/Snackbar';
const socketIoUrl = `${window.location.origin}`;

// authentication
const authSocket = io.connect(`${socketIoUrl}/auth`, {
  path: `${process.env.PUBLIC_URL}/api/socket.io`
});

authSocket.on('newuser', msg => {
  const [id, firstname, lastname, email] = msg.data;
  toast.success(
    `New User #${id} (${firstname} ${lastname} ${email}) signed up!`
  );
});

authSocket.on('updateuser', msg => {
  const [id, firstname, lastname, email] = msg.data;
  toast.success(
    `User #${id} (${firstname} ${lastname} ${email}) updated their profile.`
  );
});

// voting
const voteSocket = io.connect(`${socketIoUrl}/votes`, {
  path: `${process.env.PUBLIC_URL}/api/socket.io`
});

const voteEventEmitter = new EventEmitter();

voteSocket.on('voteupdate', response => {
  voteEventEmitter.emit('voteupdate', response);
});

export function subscribeToVotesForQuestion(qid, func) {
  const listener = response => func(response);
  voteEventEmitter.on('voteupdate', listener);
  voteSocket.emit('subscribe', { qid });
  return () => {
    voteSocket.emit('unsubscribe', { qid });
    voteEventEmitter.removeListener('voteupdate', func);
  };
}
