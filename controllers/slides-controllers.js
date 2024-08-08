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
    let newSlide = new Slide({
        title,
        description,
        presentationId
    });
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await newSlide.save({ sesseion: session });
        presentation.slides.push(newSlide);
        await presentation.save({ session: session});
        await session.commitTransaction();
    } catch(err) {
        const error = new HttpError('Could not save this slide.', 500);
        return next(error);    
    }
    if(!newSlide) {
        const error = new HttpError('Could not create slide.', 404);
        return next(error);    
    }
    res.status(200).json({slide: newSlide.toObject({getters:true})});
}
const updateSlide = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }
    const { title, description } = req.body;
    const slideId = req.params.sid;
    
    let slide;
    let checktitle;
    try {
        slide = await Slide.findById(slideId);
    } catch(err) {
        const error = new HttpError('Could not find any slide with this id. ', 500);
        return next(error);
    }
    if (!slide) {
        const error = new HttpError('You don`t have slide with this provided id.', 404);
        return next(error);    
    }
    if(title){
        try {
            checktitle = await Slide.findOne({title: title});
        } catch(err) {
            const error = new HttpError('Could not find any slide with this title. ', 500);
            return next(error);
        }
        if (checktitle) {
            const error = new HttpError('You can`t change the slide because this title already exsists.', 404);
            return next(error);    
        } else {
            slide.title = title;
        }
    } if (description) {
        slide.description = description;
    }
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
        slide = await Slide.findById(slideId).populate('presentationId');
    } catch(err) {
        const error = new HttpError('Could not find this slide.', 500);
        return next(error);  
    }
    if(!slide) {
        const error = new HttpError('Could not find this slide.', 404);
        return next(error);      
    }
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await slide.deleteOne({session: session});
        slide.presentationId.slides.pull(slide);
        await slide.presentationId.save({ session: session});
        await session.commitTransaction();
    } catch(err) {
        const error = new HttpError('Could not delete this slide.', 500);
        return next(error);  
    }
    res.status(200).json({message: "Deleted slide."});
}

exports.createSlide = createSlide;
exports.deleteSlide = deleteSlide;
exports.updateSlide = updateSlide;