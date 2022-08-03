// const client = require('./db');

// module.exports = {
//   getAll: (product_id) => {
//     const data = { product: product_id };
//     const queryString = `SELECT json_agg(questionResult) AS result FROM (SELECT\
//       q.id as question_id,\
//       q.question_body,\
//       q.question_date,\
//       u.username as asker_name,\
//       q.reported,\
//       q.question_helpfulness,(SELECT\
//         json_object_agg(av.id,\
//           (SELECT row_to_json(answerResult) FROM\
//             (SELECT a.id, a.answer_body as body, a.answer_date as date, u.username as answerer_name, a.answer_helpfulness as helpfulness, \
//             (SELECT array_agg("url") FROM photo p WHERE p.answer_id = a.id) AS photos\
//             FROM answer a LEFT JOIN "user" u ON a.user_id = u.id WHERE a.id = av.id) AS answerResult))\
//     FROM answer av\
//     WHERE av.question_id = q.id AND av.reported = false) AS answers\
//     FROM question q\
//     LEFT JOIN "user" u\
//     ON q.user_id = u.id\
//     WHERE q.product_id = ${product_id}\
//     AND q.reported = false) AS questionResult`;
//     client
//       .query(queryString)
//       .then((res) => { data.result = res.rows[0].result; return data; })
//       .catch((err) => console.log(err));
//   },
// };
