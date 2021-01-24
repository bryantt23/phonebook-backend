const express = require('express');
// https://stackoverflow.com/a/58494537
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

var morgan = require('morgan');
morgan.token('body', (req, res) => JSON.stringify(req.body));

// https://stackoverflow.com/a/55848217
app.use(
  morgan(':method :url :status :res[content-length] :body - :response-time ms')
);

// morgan.token('host', function (req, res) {
//   return req.hostname;
// });

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4
  },
  {
    name: 'Delete Me',
    number: '39-23-6423122',
    id: 5
  }
];

app.get('/api/persons', function (req, res) {
  console.log('get all');
  res.json(persons);
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

app.listen(3001);
