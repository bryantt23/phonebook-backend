const Person = require('./models/person');
const express = require('express');
// https://stackoverflow.com/a/58494537
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('build'));

var morgan = require('morgan');
morgan.token('body', (req, res) => JSON.stringify(req.body));

const errorHandler = (error, request, response, next) => {
  console.error('error handler section', error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

// https://stackoverflow.com/a/55848217
app.use(
  morgan(':method :url :status :res[content-length] :body - :response-time ms')
);

app.get('/api/persons', async function (req, res) {
  let data;
  await Person.find({}, function (err, result) {
    if (err) throw err;
    data = result;
    console.log('result: ' + JSON.stringify(result));
    // db.close();
  });
  res.json(data);
});

app.post('/api/persons', async function (req, res, next) {
  if (!req.body.number) {
    return res.status(400).send({ error: 'Missing number' });
  }
  const { name, number } = req.body;

  let newPerson = new Person({
    name,
    number
  });
  await newPerson.save().catch(err => {
    return res.status(400).send(err.message);
  });
  console.log('User has been added with ' + name + ' ' + number);

  res.redirect('/api/persons');
});

app.get('/api/persons/:id', function (req, res) {
  const id = req.params.id;
  console.log('person id', id);

  Person.findOne({ _id: id }, (err, person) => {
    if (!person) {
      return res.status(404).send({ error: 'Not found' });
    }
    if (err) {
      return res.status(404).send({ error: err });
    }
    return res.send(person);
  });
});

app.put('/api/persons/:id', async function (req, res) {
  const id = req.body._id;
  const number = req.body.number;

  const updatedPerson = await Person.findById(id).catch(err => {
    console.log('err', err);
    next(err);
  });
  updatedPerson.number = number;
  updatedPerson.save().catch(function (err) {
    console.log('err', err);
    next(err);
  });
  return res.send({
    message: `updated person: ${updatedPerson}, number to ${number}`
  });
});

// https://stackoverflow.com/questions/5809788/how-do-i-remove-documents-using-node-js-mongoose
app.delete('/api/persons/:id', async function (req, res, next) {
  const id = req.params.id;

  //command and chain catch
  const deletedItem = await Person.findOneAndDelete({ _id: id }).catch(err => {
    console.log('err', err);
    return next(err);
    // return res.status(404).send({ error: err });
  });

  //if it gets here it succeeded
  console.log('deleted id ' + id);
  res.status(200).send({ message: 'deleted ' + deletedItem });
});

app.get('/info', function (req, res) {
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  const message = `Phonebook has info for ${persons.length} people
  <br/>
    ${today.toUTCString()}`;

  res.send(message);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
