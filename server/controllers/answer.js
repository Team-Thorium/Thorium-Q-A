const models = require('../models');

module.exports = {
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
