const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const Presentation = require('../models/presentation');
const HttpError = require('../models/http-error');

const createPresentation = async (req, res, next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }
    console.log("presentation-controller, req.body ", req.body);
    const { title, authors, dateOfPublishment } = req.body;
    
    let createdPresentation;
    try {
        createdPresentation = new Presentation({
            title,
            authors,
            dateOfPublishment
        });
        await createdPresentation.save();
    } catch(err) {
        if (err.code === 11000) {
            const error = new HttpError('Error: Duplicate title.', 422);
            return next(error);
            // console.error("Error: Duplicate title");
        } else {
            const error = new HttpError(err, 404);
            return next(error);
            // console.error(erro);
        }
    }
    res.status(201).json({ presentation : createdPresentation.toObject({ getters: true }) });
};
const getPresentationByTitle = async (req, res, next) => {
    console.log("getPresentationByTitle, req.params ", req.params);
    // console.log("getPresentationByTitle, req.body ", req.body);
    const presentationTitle = req.params.ptitle;
    console.log("presentationTitle ", presentationTitle);
    let presentation;
    try {
        presentation = await Presentation.find({ title: presentationTitle });
    } catch(err) {
        const error = new HttpError('Could not get the presentation for the provided title', 500);
        return next(error);
    }
    res.status(200).json({ presentation: presentation });
}
const updatePresentationAuthors = async (req, res, next) => {
    const presentationId = req.params.pid;
    console.log("updatePresentationAuthors, presentationId ", presentationId);

    let authors = req.body.authors;
    console.log("updatePresentationAuthors, authors ", authors);

    let presentation;
    try {
        presentation = await Presentation.findById(presentationId);
        presentation.authors = authors;
        await presentation.save();
    } catch(err) {
        const error = new HttpError('Could not find presentation by the provided id.', 404);
        return next(error);
    }
    if(!presentation) {
        const error = new HttpError('Presentation not found.', 404);
        return next(error);
    }
    res.status(200).json({ presentation : presentation.toObject({ getters: true })});
}
const deletePresentation = async (req, res, next) => {
    const presentationId = req.params.pid;
    console.log(presentationId);
    let presentation;
    try {
        presentation = await Presentation.deleteOne({_id: presentationId});
    } catch(err) {
        const error = new HttpError('Could not delete presentation for the provided id.', 500);
        return next(error);
    }
    if (!presentation) {
        const error = new HttpError('Could not find and delete presentation for the provided id.', 500);
        return next(error);    
    }
    res.status(200).json({message: 'Deleted presentation.'});
}

const getAllPresntations = async (req, res, next) => {

    let presentations;
    try {
        presentations = await Presentation.find();
    } catch (err) {
        const error = new HttpError('Could not find any presentation. ', 404);
        return next(error);
    }
    console.log(presentations);
    if(!presentations.legth === 0) {
        const error = new HttpError('Could not find any presentation. ', 500);
        return next(error);
    }
    res.status(200).json({presentations : presentations.map(presentation => presentation.toObject({ getters: true}))});
}

exports.createPresentation = createPresentation;
exports.getPresentationByTitle = getPresentationByTitle;
exports.updatePresentationAuthors = updatePresentationAuthors;
exports.deletePresentation = deletePresentation;
exports.getAllPresntations = getAllPresntations;