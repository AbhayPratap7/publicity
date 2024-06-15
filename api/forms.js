const mongoose = require('mongoose');
const Form = require('../models/formModel'); // Adjust the path if necessary

async function connectToDatabase() {
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    const mongoURI = process.env.MONGO_URI.trim();
    await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
}

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        try {
            console.log('Connecting to database...');
            await connectToDatabase();
            console.log('Database connected');
            
            console.log('Saving form data...');
            const newForm = new Form(req.body);
            const savedForm = await newForm.save();
            console.log('Form data saved');
            
            res.status(201).json(savedForm);
        } catch (err) {
            console.error('Error saving form data:', err.message);
            res.status(400).json({ message: err.message });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};
