const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    roNo: { type: String },
    roNoDate: { type: Date },
    publication: { type: String },
    client: { type: String },
    publishDate: { type: [Date] },
    size: { type: String },
    type: { type: String },
    rate: { type: String },
    edition: { type: String },
    pageNo: { type: String },
    less: { type: String },
    extra: { type: String },
    note: { type: String }
});

module.exports = mongoose.model('Form', formSchema);
