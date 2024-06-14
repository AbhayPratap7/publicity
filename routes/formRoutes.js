const express = require('express');
const router = express.Router();
const Form = require('../models/formModel'); // Adjust the path if necessary

// Create a new form
router.post('/', async (req, res) => {
    try {
        const newForm = new Form(req.body);
        const savedForm = await newForm.save();
        res.status(201).json(savedForm);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Other routes (GET, PUT, DELETE) can be added similarly

module.exports = router;
