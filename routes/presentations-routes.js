const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const presentationsControllers = require('../controllers/presentations-controllers');


router.get('/:ptitle', presentationsControllers.getPresentationByTitle);

router.post('/', [check('title').not().isEmpty(), check('authors').isLength({min:1})], presentationsControllers.createPresentation);

router.patch('/:pid', presentationsControllers.updatePresentationAuthors);

router.delete('/:pid', presentationsControllers.deletePresentation);

router.get('/', presentationsControllers.getAllPresntations);

module.exports = router;