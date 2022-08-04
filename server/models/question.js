const db = require('../db');
module.exports = {
  getAll: (product_id, count, page) => {
    const queryString = `SELECT json_agg(questionResult) AS result FROM (SELECT
      q.id AS question_id,
      q.question_body,
      q.question_date,
      u."name" AS asker_name,
      q.question_helpfulness,
      q.reported,
      (SELECT
        COALESCE (json_object_agg(av.id,
          (SELECT row_to_json(answerResult) FROM
            (SELECT a.id, a.answer_body AS body, a.answer_date AS date, u."name" AS answerer_name, a.answer_helpfulness AS helpfulness,
            (SELECT COALESCE(json_agg("url"), '[]'::json) FROM photo p WHERE p.answer_id = a.id) AS photos
            FROM answer a LEFT JOIN "user" u ON a.user_id = u.id WHERE a.id = av.id) AS answerResult)), '{}'::json)
    FROM answer av
    WHERE av.question_id = q.id AND av.reported = false) AS answers
    FROM question q
    LEFT JOIN "user" u
    ON q.user_id = u.id
    WHERE q.product_id = $1
    AND q.reported = false ORDER BY q.question_helpfulness DESC limit $2 offset $3) AS questionResult`;
    return db.query(queryString, [product_id, count, page]);
  },
  post: async (product_id, data) => {
    const {
      email, name, body,
    } = data;
    console.log(typeof product_id)
    const queryUser = 'INSERT INTO "user" ("name", email) VALUES ($1, $2) ON CONFLICT (name, email) DO NOTHING;';
    const queryQuestion = `INSERT INTO question (product_id, user_id, question_body, question_date, question_helpfulness, reported)
    VALUES ($1, (SELECT id FROM "user" WHERE "name" = $2 AND email = $3 limit 1), $4, (SELECT NOW()), 0, false);`;
    try {
      const first = await db
        .query(queryUser, [name, email]);
      const second = await db
        .query(queryQuestion, [product_id, name, email, body]);
    } catch (err) {
      console.log(err);
    }
  },
  helpful: (question_id) => {
    const queryString = 'UPDATE question SET question_helpfulness = question_helpfulness + 1 WHERE id = $1';
    return db.query(queryString, [question_id]);
  },
  report: (question_id) => {
    const queryString = 'UPDATE question SET reported = true WHERE id = $1';
    return db.query(queryString, [question_id]);
  },
};
