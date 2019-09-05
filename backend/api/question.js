const express = require('express');
const questionrouter = express.Router();
const { requireLogin, requireAdmin } = require('./auth');

const {
  getUserByName,
  insertNewQuestion /* { question, description, choices, type } */,
  listQuestions /* firstPage, pgSize = Default */,
  getQuestion /* questionid */,
  deleteQuestion,
  updateQuestion /* questionid, { question, descr, choices, type } */,
  voteForQuestion /* userid, questionid, answerchoiceid, deleteoldvote = true */,
  getUserVotesForQuestion /* userid, questionid */,
  getVotesForQuestion /* questionid */
} = require('../db/queries');

questionrouter.post('/', requireAdmin, async (req, res) => {
  const { question, description, type, choices } = req.body;
  if (!question || !description || !type || !choices) {
    return res.status(400).json({ message: 'invalid request' });
  }
  try {
    let id = await insertNewQuestion(req.body);
    res.json({
      message: 'question inserted',
      id
    });
  } catch (err) {
    res.status(404).json({ message: 'failed to insert new question' });
  }
});

questionrouter.get('/:id', requireLogin, async (req, res) => {
  const id = Number(req.params.id);
  try {
    let result = await getQuestion(id);
    res.json({
      ...result,
      id
    });
  } catch (err) {
    res.status(404).json({ message: 'failed to get question' });
  }
});

questionrouter.get('/', async (req, res) => {
  const page = Number(req.query.page) || 0;
  try {
    let has_more = false;
    let questions = [];
    let results = await listQuestions(page, 6);
    // let nextQuestion = await getQuestion(page * 6 + results.length + 1);
    let nextQuestion = await listQuestions(page + 1, 6);
    has_more = nextQuestion.length !== 0;

    for (const { id, question, description, type, choices } of results)
      questions.push({ id, question, description, type, choices });

    res.json({ questions, has_more });
  } catch (err) {
    res.status(404).json({ message: 'failed to list questions' });
  }
});

questionrouter.put('/:id', requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  try {
    await updateQuestion(id, req.body);
    res.json({ message: 'update sucessful' });
  } catch (err) {
    res.status(404).json({ message: 'failed to update question' });
  }
});

questionrouter.delete('/:id', requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  try {
    await deleteQuestion(id);
    res.json({ message: 'question deleted' });
  } catch (err) {
    res.status(404).json({ message: 'failed to delete question' });
  }
});

questionrouter.post('/:id/vote', requireLogin, async (req, res) => {
  const qid = Number(req.params.id);
  try {
    let users = await getUserByName(req.user.username);
    let [{ id: uid }] = users;
    await voteForQuestion(uid, qid, req.body.choice, true);
    res.json({ message: 'vote sucessful' });
  } catch (err) {
    res.status(404).json({ message: 'failed to vote' });
  }
});

questionrouter.get('/:id/vote', requireLogin, async (req, res, next) => {
  const qid = Number(req.params.id);
  const uid = Number(req.query.user);
  if (!uid) {
    next();
  } else {
    try {
      let users = await getUserByName(req.user.username);
      let [{ id, admin }] = users;
      if (id != uid && !admin)
        return res.status(403).json({ message: 'forbidden' });

      let result = await getUserVotesForQuestion(uid, qid);
      res.json({ votes: result });
    } catch (err) {
      res.status(404).json({ message: 'failed to retrieve user vote' });
    }
  }
});

questionrouter.get('/:id/vote', requireLogin, async (req, res) => {
  const qid = Number(req.params.id);
  try {
    let result = await getVotesForQuestion(qid);
    res.json({ totals: result });
  } catch (err) {
    res.status(404).json({ message: 'failed to get total vote' });
  }
});
module.exports = questionrouter;
