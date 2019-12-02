const express = require('express');
const router = express.Router();

const note = require('../models/note');
const { isAuthenticated } = require('../guards/authenticator');

router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/addnote');
});

router.post('/notes/new', isAuthenticated, async (req, res) => {
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
        newNote.user = req.user.id
        await newNote.save();
        req.flash('sucmsg', 'Your note has been successfully ADDED');
        res.redirect('/notes');
    }
});

router.get('/notes', isAuthenticated, async (req, res) => {
    const notes = await note.find({ user: req.user.id }).sort({date: 'desc'});
    res.render('notes/allnotes', {
        notes
    });
});

router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
    const mynote = await note.findById(req.params.id)
    res.render('notes/editnote', {mynote});
});

router.put('/notes/editnote/:id', isAuthenticated, async (req, res) => {
    await note.findByIdAndUpdate(req.params.id, req.body);
    req.flash('sucmsg', 'Your note has been successfully UPDATED');
    res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
    await note.findByIdAndDelete(req.params.id);
    req.flash('sucmsg', 'Your note has been successfully DELETED');
    res.redirect('/notes');
});

module.exports = router;