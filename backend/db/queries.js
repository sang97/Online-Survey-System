// This file contains your database layer
//@ts-check
const dbPool = require('./pool');
const fs = require('fs');

async function rebuildDatabase() {
  const createDbScript = `${__dirname}/createdb.sql`;

  const sql = fs.readFileSync(createDbScript, 'utf8');
  return dbPool.query(sql);
}

async function getUserById(userid) {
  return dbPool.query(`SELECT * FROM users WHERE id = ?`, [userid]);
}

async function deleteUser(userid) {
  return dbPool.query(`DELETE FROM users WHERE id = ?`, [userid]);
}

async function getUserByName(username) {
  return dbPool.query(`SELECT * FROM users WHERE username = ?`, [username]);
}

async function addUser(user) {
  let result = await dbPool.query(`INSERT INTO users SET ?`, user);
  return result.insertId;
}

async function setAdminState(id, state) {
  return dbPool.query(`UPDATE users SET admin = ? WHERE id = ?`, [state, id]);
}

async function listUsers(firstPage, pgSize) {
  let ids = await dbPool.query(`SELECT id FROM users ORDER BY id`);
  let id = ids.map(i => i.id);
  id = id.slice(pgSize * firstPage, pgSize * firstPage + pgSize);
  return id.length == 0
    ? []
    : await dbPool.query(`SELECT * FROM users WHERE id IN (?)`, [id]);
}

async function updateUser(id, update) {
  let query = `UPDATE users SET ? WHERE id = ?`;
  let result = await dbPool.query(query, [update, id]);
  if (result) {
    return {
      affectedRows: result.affectedRows,
      changedRows: result.changedRows
    };
  }
  return { code: 'ER_DUP_ENTRY' };
}

async function insertNewQuestion(info) {
  const { question, description, type, choices } = info; //destruction object
  let query = `INSERT INTO questions SET ?`;
  let q = await dbPool.query(query, [{ question, description, type }]);
  let position = 0;
  let answers = choices.map(choice => [choice, q.insertId, position++]);
  query = `INSERT INTO answerchoices (description, questionid, position) VALUES ?`;
  await dbPool.query(query, [answers]);
  return q.insertId;
}

async function listQuestions(firstPage, pgSize = 5) {
  let ids = await dbPool.query(`SELECT id FROM questions ORDER BY id`);
  let id = ids.map(i => i.id);
  id = id.slice(pgSize * firstPage, pgSize * firstPage + pgSize);
  return id.length == 0
    ? []
    : await dbPool.query(`SELECT * FROM questions WHERE id IN (?)`, [id]);
}

async function getQuestion(id) {
  let query = `SELECT * FROM questions WHERE id = ?`;
  let resultQuestion = await dbPool.query(query, [id]);
  query = `SELECT description, id FROM answerchoices WHERE questionid = ? ORDER BY position`;
  let resultChoice = await dbPool.query(query, [id]);

  let info = undefined;
  await Promise.all([resultQuestion, resultChoice])
    .then(result => {
      if (result[0].length != 0 && result[1].length != 0) {
        info = {
          ...result[0][0],
          choices: result[1]
        };
      }
    })
    .catch(err => {
      return err;
    });
  return info;
}

async function updateQuestion(questionid, info) {
  const { question, description, type, choices } = info;
  // when a question is updated, all votes for it should be cleared
  await dbPool.query(`DELETE FROM votes WHERE questionid = ?`, [questionid]);
  await dbPool.query(`DELETE FROM answerchoices WHERE questionid = ?`, [
    questionid
  ]);

  let query = `UPDATE questions SET ? WHERE id = ?`;
  await dbPool.query(query, [{ question, description, type }, questionid]);

  let position = 0;
  let answers = choices.map(choice => [choice, questionid, position++]);
  query = `INSERT INTO answerchoices (description, questionid, position) VALUES ?`;
  await dbPool.query(query, [answers]);
  return questionid;
}

async function voteForQuestion(
  userid,
  questionid,
  answerchoiceid,
  deleteoldvote
) {
  if (deleteoldvote) {
    let query = `DELETE FROM votes WHERE userid = ? and questionid = ?`;
    await dbPool.query(query, [userid, questionid]);
  }
  let query = `INSERT INTO votes SET ?`;
  let result = await dbPool.query(query, [
    { userid, questionid, answerchoiceid }
  ]);
  if (result) {
    return { affectedRows: result.affectedRows };
  }
  return undefined;
}

async function getUserVotesForQuestion(userid, questionid) {
  let query = `SELECT answerchoiceid FROM votes WHERE userid = ? and questionid = ?`;
  let result = await dbPool.query(query, [userid, questionid]);
  return [result[0].answerchoiceid];
}

async function getVotesForQuestion(questionid) {
  let query = `SELECT answerchoiceid, COUNT(*) AS choicecount FROM votes WHERE questionid = ? GROUP BY answerchoiceid`;
  let results = await dbPool.query(query, [questionid]);

  return results.map(result => ({
    choice: result.answerchoiceid,
    count: result.choicecount
  }));
}

async function deleteQuestion(questionid) {
  let query = `SELECT * FROM questions WHERE id = ?`;
  let result = await dbPool.query(query, [questionid]);
  if (result[0].length != 0) {
    await dbPool.query(`DELETE FROM votes WHERE questionid = ?`, [questionid]);
    await dbPool.query(`DELETE FROM answerchoices WHERE questionid = ?`, [
      questionid
    ]);
    await dbPool.query(`DELETE FROM questions WHERE id = ?`, [questionid]);
  }
}

module.exports = {
  rebuildDatabase,
  addUser,
  getUserById,
  getUserByName,
  setAdminState,
  listUsers,
  updateUser,
  deleteUser,
  insertNewQuestion /* { question, description, choices, type } */,
  listQuestions /* firstPage, pgSize = Default */,
  getQuestion /* questionid */,
  deleteQuestion /* questionid */,
  updateQuestion /* questionid, { question, descr, choices, type } */,
  voteForQuestion /* userid, questionid, answerchoiceid, deleteoldvote = true */,
  getUserVotesForQuestion /* userid, questionid */,
  getVotesForQuestion /* questionid */
};
