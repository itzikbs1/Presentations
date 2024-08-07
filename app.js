const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const presentationsRoutes = require('./routes/presentations-routes');
// const slidesRoutes = require('./routes/slides-routes');

const app = express();

app.use(bodyParser.json());

app.use('/api/presentations', presentationsRoutes);
// app.use('/api/slides', slidesRoutes);


// const url = 'mongodb+srv://reviewer:!bEDv.#qXK5_WmE@cluster0.mongodb.net/presentation?retryWrites=true&w=majority';
// const url = 'mongodb+srv://reviewer:%21bEDv.%23qXK5_WmE@cluster0.mongodb.net/presentation?retryWrites=true&w=majority';
const url = 'mongodb+srv://itzik:ic5jpUQGf2xHuDA6@cluster0.v2xxhfv.mongodb.net/presentation?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(url)
        .then(() => {
            app.listen(5000, () => {
                console.log('Server is running on port 5000');
            }) 
        })
        .catch(err => {
            console.log(err);
        });