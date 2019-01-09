require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(cors())
app.use(helmet())

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  // move to the next middleware
  next()
})

const cards = [];
const lists = [];

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.get('/card', (req, res) => {
  res
    .json(cards);
});

app.get('/card/:id', (req, res) => {
  const { id } = req.params;
  const card = cards.find(c => c.id === id);

  // make sure we found a card
  if(!card) {
    return res
      .status(404)
      .send('Card Not Found');
  }

  res.json(card);
});

app.get('/list', (req, res) => {
  res
    .json(lists);
});

app.get('/list/:id', (req, res) => {
  const { id } = req.params;
  const list = lists.find(li => li.id === id);

  // make sure we found a list
  if(!list) {
    return res
      .status(404)
      .send('List Not Found');
  }

  res.json(list);
});

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    response = { error }
  }
  res.status(500).json(response)
})

module.exports = app
