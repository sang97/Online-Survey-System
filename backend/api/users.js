const express = require('express');
const bcrypt = require('bcrypt');
const nconf = require('nconf');
const saltNumber = nconf.get('bcryptsaltrounds');
const { requireLogin, requireAdmin, makeToken } = require('./auth');
const userrouter = express.Router();
const redis = require('redis');

const redisClient = redis.createClient();
const { authRedisChannel } = require('../realtime/channels');

const {
  addUser /* { ... user } */,
  getUserById /* id */,
  getUserByName /* name */,
  deleteUser,
  listUsers /* firstPage, pgSize */,
  updateUser /* id, { ...user } */
} = require('../db/queries');

// implement your endpoints here
userrouter.post('/', async (req, res) => {
  const { username, password, firstname, lastname, email } = req.body;
  if (!username || !email || !firstname || !lastname || !password) {
    return res.status(400).json({ message: 'invalid request' });
  }
  if ((await getUserByName(username)).length > 0) {
    return res.status(409).json({ message: 'duplicated user' });
  }
  let user = {
    username,
    password: await bcrypt.hash(password, saltNumber),
    email,
    firstname,
    lastname,
    admin: 0
  };

  let id = await addUser(user);
  delete user.password;
  user.id = id;
  makeToken(user);

  redisClient.publish(
    authRedisChannel,
    `newuser ${id} ${firstname} ${lastname} ${email}`
  );

  res.json({
    token: user.token,
    user,
    message: 'user created'
  });
});

userrouter.get('/:id', async (req, res) => {
  const uid = Number(req.params.id);
  try {
    const users = await getUserById(uid);
    const [{ id, username, email, lastname, firstname }] = users;
    res.status(200).json({
      id,
      username,
      email,
      lastname,
      firstname
    });
  } catch (error) {
    res.status(404).json({ message: 'failed to retrieve user' });
  }
});

userrouter.get('/', requireAdmin, async (req, res) => {
  const page = Number(req.query.page) || 0;
  try {
    let has_more = false;
    let users = [];
    let results = await listUsers(page, 10);
    let [nextuser] = await getUserById(page * 10 + results.length + 1);
    has_more = nextuser !== undefined;

    for (const { username, id, lastname, firstname, email, admin } of results) {
      users.push({ username, id, lastname, firstname, email, admin });
    }

    res.json({ users, has_more });
  } catch (error) {
    res.status(404).json({ message: 'failed to list users' });
  }
});

userrouter.put('/:id', requireLogin, async (req, res) => {
  const id = Number(req.params.id);
  try {
    let { firstname, lastname, password } = req.body;
    if (password.length == 0) {
      return res.status(403).json({ message: 'invalid password' });
    }
    password = await bcrypt.hash(password, saltNumber);
    await updateUser(id, { firstname, lastname, password });
    let [user] = await getUserById(id);

    redisClient.publish(
      authRedisChannel,
      `updateuser ${id} ${firstname} ${lastname} ${user.email}`
    );

    res.json({ user, message: 'updated' });
  } catch (error) {
    res.status(403).json({ message: 'failed to update' });
  }
});

userrouter.delete('/:id', requireLogin, async (req, res) => {
  const id = Number(req.params.id);
  try {
    await deleteUser(id);
    res.json({ message: 'user deleted' });
  } catch (error) {
    res.status(404).json({ message: 'failed to delete' });
  }
});

module.exports = userrouter;
