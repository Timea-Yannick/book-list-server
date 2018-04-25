'use strict';

const pg = require('pg');
const cors = require('cors')
const express = require('express');
const app = express();

const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

const CLIENT = new pg.Client(process.env.DATABASE_URL);
CLIENT.connect();
CLIENT.on('error', err => console.error(err));

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.redirect(CLIENT_URL)) ;
app.get('/test', (req, res) => res.send('Hello World!'));
app.get('/test/*', (req, res) => res.send('no further API routes'));

app.get('/api/v1/books', (req, res) => {
  client.query(`SELECT * FROM books;`)
  .then(results => res.send(results.rows))
  .catch(console.error);
});

app.get('/api/v1/books/:id', (req, res) => {
  client.query(`SELECT * FROM books WHERE book_id = ${req.params.id};`)
  .then(results => res.send(results.rows))
  .catch(console.error);
});
 
app.get('*', (req, res) => res.send('404 service not found'));
app.listen(PORT, () => console.log(`listening on port: ${PORT}`));



