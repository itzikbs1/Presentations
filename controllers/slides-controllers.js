const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Slide = require('../models/slide');
const Presentation = require('../models/presentation');

const createSlide = async (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { title, description, presentationId } = req.body;

    let presentation;
    try {
        presentation = await Presentation.findById(presentationId);
    } catch(err) {
        const error = new HttpError('Could not find this presentation by the provided id.', 500);
        return next(error);
    }
    if(!presentation) {
        const error = new HttpError('Presentation with this id dosent exsist, so you can`t create slide with this presentation id.', 404);
        return next(error);
    }
    let slideCheck;
    try {   
        slideCheck = await Slide.findOne({ title : title });
    } catch(err) {
        const error = new HttpError('Could not find this slide.', 500);
        return next(error);
    }
    if(slideCheck) {
        const error = new HttpError("This title slide already exsists, try again with different title.", 422);
        return next(error);
    }
    let slide = new Slide({
        title,
        description,
        presentationId
    });
    try {
        await slide.save();
    } catch(err) {
        const error = new HttpError('Could not save this slide.', 500);
        return next(error);    
    }
    if(!slide) {
        const error = new HttpError('Could not create slide.', 500);
        return next(error);    
    }
    res.status(200).json({slide: slide.toObject({getters:true})});
}

const deleteSlide = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }
    const slideId = req.params.sid;
    let slide;
    try {
        slide = await Slide.findByIdAndDelete(slideId);
    } catch(err) {
        const error = new HttpError('Could not find and delete this slide.', 500);
        return next(error);  
    }
    if(!slide) {
        const error = new HttpError('Could not find this slide.', 404);
        return next(error);      
    }
    res.status(200).json({message: "Deleted slide."});
}

exports.createSlide = createSlide;
exports.deleteSlide = deleteSlide;