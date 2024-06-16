const express = require('express');
const router = express.Router();
const Form = require('../models/formModel');
const { appendToSheet } = require('../googleSheetsHelper'); // Importing the appendToSheet function

// Create a new form
router.post('/', async (req, res) => {
    try {
        const newForm = new Form(req.body);
        const savedForm = await newForm.save();

        // Prepare data to append to Google Sheets
        const formDataArray = [
            req.body.roNo,
            req.body.roNoDate,
            req.body.publication,
            req.body.client,
            req.body.publishDates.join(', '), // Join publish dates with comma
            req.body.size,
            req.body.type,
            req.body.rate,
            req.body.edition,
            req.body.pageNo,
            req.body.less,
            req.body.extra,
            req.body.note
        ]; // Adjust according to your form fields and data structure

        // Call the helper function to append data to Google Sheets
        await appendToSheet(formDataArray);

        res.status(201).json(savedForm);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
