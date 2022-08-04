const router = require('express').Router();
const controller = require('./controllers');

router.get('/question', controller.question.get);
router.post('/:id', controller.question.post);
router.post('/:id/answers', controller.answer.post);
router.put('/question/:id/helpful', controller.question.helpful);
router.put('/answer/:id/helpful', controller.answer.helpful);
router.put('/question/:id/report', controller.question.report);
router.put('/answer/:id/report', controller.answer.helpful);

module.exports = router;
