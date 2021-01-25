require('dotenv').config();

const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const mongoDb = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qx7so.mongodb.net/persons?retryWrites=true&w=majority`;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

// const mongoose = require('mongoose');

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

PersonInstanceSchema.plugin(uniqueValidator);

// Virtual for persons's URL
PersonInstanceSchema.virtual('url').get(function () {
  return '/person/' + this._id;
});

module.exports = mongoose.model('Person', PersonInstanceSchema);
