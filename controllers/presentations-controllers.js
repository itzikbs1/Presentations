const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Presentation = require('../models/presentation');
const Slide = require('../models/slide');

const createPresentation = async (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

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
        } else {
            const error = new HttpError(err, 404);
            return next(error);
        }
    }
    res.status(201).json({ presentation : createdPresentation.toObject({ getters: true }) });
};
const getPresentationByTitle = async (req, res, next) => {
    const presentationTitle = req.params.ptitle;

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

    let author = req.body.authors[0];

    let presentation;
    try {
        presentation = await Presentation.findById(presentationId);
        let authors = presentation.authors;
        if (authors.includes(author)) {
            authors = authors.filter(au => au !== author);
        } else {
            authors.push(author);
        }
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
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }
    const presentationId = req.params.pid;
    let presentation;
    try {
        presentation = await Presentation.findById(presentationId);
    } catch (err) {
        const error = new HttpError('Could not find presentation for the provided id.', 404);
        return next(error); 
    }
    if (!presentation) {
        const error = new HttpError('Could not find presentation for the provided id.', 500);
        return next(error);    
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        await Slide.deleteMany({presentationId: presentationId}).session(session);
        presentation = await Presentation.deleteOne({_id: presentationId}).session(session);
        await session.commitTransaction();
    } catch(err) {
        await session.abortTransaction();
        const error = new HttpError('Could not delete presentation for the provided id.', 500);
        return next(error);
    }
    await session.endSession();

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
    if(!presentations.length === 0) {
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