const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(morgan('common'));
app.use(cors());

const apps = require('./playstore-data');

app.get('/apps', (req, res) => {
    const { sort, Genres='' } = req.query;

    if(sort) {
        if(!['rating', 'app'].includes(sort)) {
            return res
                .status(400)
                .send('Sort must be one of rating or app');
        }
    }

    if(Genres) {
        if(!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(Genres)) {
            res
                .status(400)
                .send('Genre must be Action, Puzzle, Strategy, Casual, Arcade, or Card')
        }
    }

    let results = apps.filter(app =>
        app
            .Genres
            .toLowerCase()
            .includes(Genres.toLowerCase()));

    if(sort) {
        apps
            .sort((a, b) => {
                return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
            });
    }

    res
        .json(results);
})

module.exports = app;