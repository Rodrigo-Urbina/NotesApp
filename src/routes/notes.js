const express = require('express');
const router = express.Router();

const note = require('../models/note');

router.get('/notes/add', (req, res) => {
    res.render('notes/addnote');
});

router.post('/notes/new', async (req, res) => {
    const { title, description } = req.body;
    const errors = [];

    if (!title) {
        errors.push({ text: 'Title field is missing' });
    }

    if (!description) {
        errors.push({ text: "Description field is missing" });
    }

    if (errors.length > 0) {
        res.render('notes/addnote', {
            errors,
            title,
            description
        });
    } else {
        const newNote = new note(req.body)
        await newNote.save();
        res.redirect('/notes');
    }
});

router.get('/notes', async (req, res) => {
    const notes = await note.find().sort({date: 'desc'});
    res.render('notes/allnotes', {
        notes
    });
});

module.exports = router;