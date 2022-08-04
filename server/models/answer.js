const db = require('../db');

module.exports = {
  post: async (data, question_id) => {
    const {
      email, name, body, photos,
    } = data;
    const queryUser = 'INSERT INTO "user" ("name", email) VALUES ($1, $2) ON CONFLICT (name, email) DO NOTHING;';
    const queryAnswer = `INSERT INTO answer (question_id, user_id, answer_body, answer_date, answer_helpfulness, reported)
        VALUES ($1, (SELECT id FROM "user" WHERE "name" = $2 AND email = $3 limit 1), $4, (SELECT NOW()), 0, false) RETURNING id;`;
    const queryPhoto = 'INSERT INTO photo (answer_id, "url") VALUES ($1, $2)';
    try {
      const user = await db.query(queryUser, [name, email]);
      const answer = await db.query(queryAnswer, [question_id, name, email, body])
        .then((result) => {
          if (photos.length > 0) {
            photos.forEach((url) => {
              db.query(queryPhoto, [result.rows[0].id, url]);
            });
          }
        })
    } catch (err) {
      console.log(err);
    }
  },
  helpful: (answer_id) => {
    const queryString = 'UPDATE answer SET answer_helpfulness = answer_helpfulness + 1 WHERE id = $1';
    return db.query(queryString, [answer_id]);
  },
  report: (answer_id) => {
    const queryString = 'UPDATE answer SET reported = true WHERE id = $1';
    return db.query(queryString, [answer_id]);
  },
};
