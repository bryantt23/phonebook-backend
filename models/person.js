const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const PersonInstanceSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
    unique: true
  },
  number: {
    type: String
  }
});

// Virtual for persons's URL
PersonInstanceSchema.virtual('url').get(function () {
  return '/person/' + this._id;
});

module.exports = mongoose.model('Person', PersonInstanceSchema);
