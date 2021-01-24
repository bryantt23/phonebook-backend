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

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

app.post('/api/persons', function (req, res) {
  if (!req.body.name) {
    return res.send({ error: 'Missing name' });
  }
  if (!req.body.number) {
    return res.send({ error: 'Missing number' });
  }
  const { name, number } = req.body;
  if (persons.find(person => person.name === name)) {
    return res.send({ error: 'Name must be unique' });
  }
  console.log(name + ' ' + number);
  let index = getRandomArbitrary(100, 10000000);
  persons.push({ name, number, id: index });
  res.redirect('/api/persons');
});

app.get('/api/persons/:id', function (req, res) {
  const id = Number(req.params.id);
  console.log('person id', id);
  const person = persons.find(person => person.id === id);
  if (person) {
    res.send(person);
  } else {
    res.status(404).send({ error: 'Not found' });
  }
});

app.delete('/api/persons/:id', function (req, res) {
  const id = Number(req.params.id);
  const personIndex = persons.findIndex(person => person.id === id);
  if (personIndex > -1) {
    persons.splice(personIndex, 1);
    res.redirect('/api/persons');
  } else {
    res.status(404).send({ error: 'Not found' });
  }
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
