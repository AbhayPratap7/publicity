const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    roNo: { type: String, required: true },
    roNoDate: { type: Date, required: true },
    publication: { type: String },
    client: { type: String },
    publishDate: { type: [Date] },
    size: { type: String },
    type: { type: String },
    rate: { type: String },
    edition: { type: String },
    pageNo: { type: String, required: true },
    less: { type: String },
    extra: { type: String },
    note: { type: String }
});

module.exports = mongoose.model('Form', formSchema);
