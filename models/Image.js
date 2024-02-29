const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    imageUrl: String,
    naming: String, 
    text: String,
},
{
    timestamps: true
  });

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
