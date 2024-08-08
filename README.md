# Presentation

## Overview
This project is a Presentation Management System built with Node.js, Express.js, and MongoDB. The system allows users to manage presentations and slides, offering functionality to create, update, and delete presentations and their associated slides.

## Features
### Presentation
- **Create a new presentation:** Add a new presentation with a unique title, a list of authors, the date of publishment, and associated slides.
- **Fetch a presentation by title:** Retrieve details of a presentation using its unique title.
- **Update author list by ID:** Modify the list of authors for a presentation using its ID.
- **Delete presentation by ID:** Remove a presentation and all its associated slides using the presentation's ID.
- **Get all presentations:** Fetch all the presentations available in the system.

### Slide
- **Add a slide to a presentation:** Insert a new slide into a specific presentation.
- **Update a slide:** Modify the details of an existing slide.
- **Delete a slide:** Remove a slide from a presentation.

## Models
### Presentation
- **title:** String (Unique) - The title of the presentation.
- **authors:** Array - A list of authors for the presentation.
- **dateOfPublishment:** Date - The publish date of the presentation.
- **slides:** Array - Contains all the slide IDs of type ObjectId that associated with this presentation.

### Slide
- **title:** String (Unique) - The title of the slide.
- **description:** String - A brief description of the slide.
- **presentationId:** ObjectId - The ID of the presentation to which this slide belongs.
## API Endpoints
### Presentation Routes (/api/presentations)
- **GET /api/presentations/**
: Fetch a presentation by its title.
- **POST /api/presentations**: Create a new presentation. (Requires title and authors)
- **PATCH /api/presentations/**
: Update the author list of a presentation by its ID.
- **DELETE /api/presentations/**
: Delete a presentation by its ID.
- **GET /api/presentations**: Get all presentations.

### Slide Routes (/api/slides)
- **POST /api/slides**: Add a new slide to a presentation. (Requires title, description, and presentationId)
- **PATCH /api/slides/**
: Update an existing slide by its ID.
- **DELETE /api/slides/**
: Delete a slide by its ID.


# How to run:
- git clone https://github.com/itzikbs1/Presentations.git
- cd Presentations
- npm install
- set up the .env for the MongoDB connection. MONGODB_URI=your_mongodb_uri, PORT=your_preferred_port
- npm start
