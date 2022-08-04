const router = require('express').Router();
const controller = require('./controllers');

router.get('/questions', controller.question.get);
router.get('/questions/:id/answers', controller.answer.get);
router.post('/questions', controller.question.post);
router.post('/questions/:id/answers', controller.answer.post);
router.put('/questions/:id/helpful', controller.question.helpful);
router.put('/answers/:id/helpful', controller.answer.helpful);
router.put('/questions/:id/report', controller.question.report);
router.put('/answers/:id/report', controller.answer.report);

module.exports = router;
