const express = require('express');
const app = express();

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
  res.json(persons);
});

app.get('/api/persons/:id', function (req, res) {
  const id = Number(req.params.id);
  console.log(id);
  const person = persons.find(person => person.id === id);
  if (person) {
    res.send(person);
  } else {
    res.status(404).send('Not found');
  }
});

app.delete('/api/persons/:id', function (req, res) {
  const id = Number(req.params.id);
  const personIndex = persons.findIndex(person => person.id === id);
  if (personIndex > -1) {
    persons.splice(personIndex, 1);
    res.redirect('/api/persons');
  } else {
    res.status(404).send('Not found');
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
