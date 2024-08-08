const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const presentationsRoutes = require('./routes/presentations-routes');
const slidesRoutes = require('./routes/slides-routes');

const app = express();

app.use(bodyParser.json());

app.use('/api/presentations', presentationsRoutes);
app.use('/api/slides', slidesRoutes);


// const url = 'mongodb+srv://reviewer:!bEDv.#qXK5_WmE@cluster0.mongodb.net/presentation?retryWrites=true&w=majority';
// const url = 'mongodb+srv://reviewer:%21bEDv.%23qXK5_WmE@cluster0.mongodb.net/presentation?retryWrites=true&w=majority';

const url = 'mongodb+srv://itzik:ic5jpUQGf2xHuDA6@cluster0.v2xxhfv.mongodb.net/presentation?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            app.listen(process.env.PORT); 
        })
        .catch(err => {
            console.log(err);
        });
        