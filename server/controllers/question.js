const models = require('../models');

module.exports = {
  get: (req, res) => {
    const product_id = req.query.product_id;
    const count = req.params.count || 5;
    const page = req.params.page || 0;
    const data = {};
    data.product_id = product_id;
    // console.log(product_id);
    models.question.get(product_id, count, page)
      .then((results) => {
        const data = {};
        data.product_id = product_id;
        data.results = results.rows[0].result;
        res.send(data);
      })
      .catch((err) => {
        console.log('get all models error', err);
        res.sendStatus(500);
      });
  },
  post: (req, res) => {
    models.question.post(req.body)
      .then(() => {
        res.sendStatus(201);
      })
      .catch((err) => {
        console.log('questions model post request', err);
        res.sendStatus(500);
      });
  },
  helpful: (req, res) => {
    models.question.helpful(req.params.id)
      .then(() => {
        res.sendStatus(204);
      })
      .catch((err) => {
        console.log('questions model helpful put request', err);
        res.sendStatus(500);
      });
  },
  report: (req, res) => {
    models.question.report(req.params.id)
      .then(() => {
        res.sendStatus(204);
      })
      .catch((err) => {
        console.log('questions model report put request', err);
        res.sendStatus(500);
      });
  },
};
