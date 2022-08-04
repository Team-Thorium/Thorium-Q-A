const models = require('../models');

module.exports = {
  get: (req, res) => {
    const data = {
      question_id: req.params.id, count: req.query.count || 5, page: req.query.page || 1,
    };
    models.answer.get(data.question_id, data.count, data.page)
      .then((result) => {
        data.result = result.rows[0].result;
        res.send(data);
      })
      .catch((err) => {
        console.log('answer model get request', err);
        res.sendStatus(500);
      });
  },
  post: (req, res) => {
    models.answer.post(req.body, req.params.id)
      .then(() => {
        res.sendStatus(201);
      })
      .catch((err) => {
        console.log('answer model post request', err);
        res.sendStatus(500);
      });
  },
  helpful: (req, res) => {
    models.answer.helpful(req.params.id)
      .then(() => {
        res.sendStatus(204);
      })
      .catch((err) => {
        console.log('answer model helpful put request', err);
        res.sendStatus(500);
      });
  },
  report: (req, res) => {
    models.answer.report(req.params.id)
      .then(() => {
        res.sendStatus(204);
      })
      .catch((err) => {
        console.log('answer model report put request', err);
        res.sendStatus(500);
      });
  },
};
