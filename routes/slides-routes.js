const express = require('express');
const router = express.Router();

const slidesControllers = require('../controllers/slides-controllers');

router.post('/', slidesControllers.createSlide);



router.delete('/:sid', slidesControllers.deleteSlide);

module.exports = router;