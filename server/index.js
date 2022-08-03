const express = require('express');
const db = require('./db');

const app = express();
app.use(express.json());

app.get('/qa/:id', (req, res) => {
  const product_id = req.params.id;
  const count = req.params.count || 5;
  const page = req.params.page || 0;
  const data = { product: product_id };
  const queryString = `SELECT json_agg(questionResult) AS result FROM (SELECT
    q.id AS question_id,
    q.question_body,
    q.question_date,
    u."name" AS asker_name,
    q.reported,
    q.question_helpfulness,
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
  WHERE q.product_id = ${product_id}
  AND q.reported = false ORDER BY q.question_helpfulness DESC limit ${count} offset ${page}) AS questionResult`;

  db
    .query(queryString)
    .then((result) => {
      data.result = result.rows[0].result;
      res.send(data);
    })
    .catch((err) => console.log(err));
});

app.post('/qa', async (req, res) => {
  const {
    email, name, body, product_id
  } = req.body;
  // console.log(name, email, body, product_id);
  const queryUser = 'INSERT INTO "user" ("name", email) VALUES ($1, $2) ON CONFLICT (name, email) DO NOTHING;';
  const queryQuestion = `INSERT INTO question (product_id, user_id, question_body, question_date, question_helpfulness, reported)
VALUES ($1, (SELECT id FROM "user" WHERE "name" = $2 AND email = $3 limit 1), $4, (SELECT NOW()), 0, false);`;
  try {
    const first = await db
      .query(queryUser, [name, email]);
    const second = await db
      .query(queryQuestion, [product_id, name, email, body]);
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
  }
});
app.post('/qa/:id/answers', async (req, res) => {
  const {
    email, name, body, photos,
  } = req.body;
  const question_id = req.params.id;
  // console.log(req.body, req.params);
  const queryUser = 'INSERT INTO "user" ("name", email) VALUES ($1, $2) ON CONFLICT (name, email) DO NOTHING;';
  const queryAnswer = `INSERT INTO answer (question_id, user_id, answer_body, answer_date, answer_helpfulness, reported)
  VALUES ($1, (SELECT id FROM "user" WHERE "name" = $2 AND email = $3 limit 1), $4, (SELECT NOW()), 0, false) RETURNING id;`;
  const queryPhoto = 'INSERT INTO photo (answer_id, "url") VALUES ($1, $2)';
  try {
    const user = await db.query(queryUser, [name, email]);
    const answer = await db.query(queryAnswer, [question_id, name, email, body])
      .then((result) => {
        console.log(result.rows[0].id);
        if (photos.length > 0) {
          photos.forEach((url) => {
            db.query(queryPhoto, [result.rows[0].id, url]);
          });
        }
      });
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
  }
});

app.put('/qa/question/:id/helpful', (req, res) => {
  const question_id = req.params.id;
  const queryString = 'UPDATE question SET question_helpfulness = question_helpfulness + 1 WHERE id = $1';
  db.query(queryString, [question_id])
    .then(() => res.sendStatus(204))
    .catch((err) => console.log(err));
});
app.put('/qa/answer/:id/helpful', (req, res) => {
  const answer_id = req.params.id;
  const queryString = 'UPDATE answer SET answer_helpfulness = answer_helpfulness + 1 WHERE id = $1';
  db.query(queryString, [answer_id])
    .then(() => res.sendStatus(204))
    .catch((err) => console.log(err));
});
app.put('/qa/question/:id/report', (req, res) => {
  const question_id = req.params.id;
  const queryString = 'UPDATE question SET reported = true WHERE id = $1';
  db.query(queryString, [question_id])
    .then(() => res.sendStatus(204))
    .catch((err) => console.log(err));
});
app.put('/qa/answer/:id/report', (req, res) => {
  const answer_id = req.params.id;
  const queryString = 'UPDATE answer SET reported = true WHERE id = $1';
  db.query(queryString, [answer_id])
    .then(() => res.sendStatus(204))
    .catch((err) => console.log(err));
});
app.listen(process.env.PORT || 3000);

// SELECT COALESCE ((SELECT array_agg("url") FROM photo p WHERE p.answer_id = a.id) AS photos, [])

// (SELECT array_agg("url") FROM photo p WHERE p.answer_id = a.id) AS photos