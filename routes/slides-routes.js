const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const slidesControllers = require('../controllers/slides-controllers');

router.post('/', [check('title').not().isEmpty(), check('description').not().isEmpty(), check('presentationId').not().isEmpty()] , slidesControllers.createSlide);

router.patch('/:sid', slidesControllers.updateSlide);

router.delete('/:sid', slidesControllers.deleteSlide);

module.exports = router;