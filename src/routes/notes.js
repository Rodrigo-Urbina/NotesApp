const express = require('express');
const router = express.Router();

router.get('/notes/add', (req, res) => {
    res.render('notes/addnote');
});

router.post('/notes/new', (req, res) => {
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
        res.send('ok');
    }
});

router.get('/notes', (req, res) => {
    res.send('NOTES');
});

module.exports = router;