const mongoose = require('mongoose');
const Form = require('../models/formModel'); // Adjust the path if necessary

// Connect to MongoDB
async function connectToDatabase() {
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    const mongoURI = process.env.MONGO_URI.trim();
    await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

export default async (req, res) => {
    if (req.method === 'POST') {
        try {
            await connectToDatabase();
            const newForm = new Form(req.body);
            const savedForm = await newForm.save();
            res.status(201).json(savedForm);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};
