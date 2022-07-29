const client = require('./db');

const getAllQuestion = () => {
  let data = [];
  const queryString = 'SELECT\
      u.username,\
      q.id,\
      q.question_body,\
      q.question_date,\
      q.question_helpfulness,\
      q.reported\
    FROM question q\
    LEFT JOIN "user" u\
    ON q.user_id = u.id\
    WHERE q.product_id = 1\
    AND q.reported = false'
  client
    .query(queryString)
    .then((res) => { data = res.rows; console.log(data); })
    .catch((err) => console.log(err));
};
getAllQuestion();