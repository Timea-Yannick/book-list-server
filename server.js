'use strict';

const fs = require('fs');
const pg = require('pg');
const cors = require('cors')
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL;
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://postgres:1234@localhost:5432/books_app');
client.connect();
client.on('error at the beginning', err => console.error(error));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

//Undefined error on local host
app.get('/', (req, res) => res.redirect(CLIENT_URL)) ;
app.get('/test', (req, res) => res.send('Hello World!'));
app.get('/test/*', (req, res) => res.send('no further API routes'));

app.get('/api/v1/books', (req, res) => {
  console.log('in route')
  client.query(`SELECT * FROM books;`)
  .then(results => {
    console.log(results.rows)
  res.send(results.rows)})
  .catch(console.error);
});

app.get('/api/v1/books/:id', (req, res) => {
  client.query(`SELECT * FROM books WHERE book_id = ${req.params.id};`)
  .then(results => res.send(results.rows[0]))
  .catch(error => {
    console.error(error);
    res.sendStatus(500).send('Error select one book');
  })
});
 
app.get('*', (req, res) => res.send('404 service not found'));
app.listen(PORT, () => console.log(`listening on port: ${PORT}`));
app.post('/api/v1/books', (req, res) => {
  console.log(req.body.book);
  let insert = `INSERT INTO books (title, author, isbn, image_url, description) VALUES($1, $2, $3, $4, $5)`
  let VALUES = [req.body.title,
  req.body.author,
  req.body.isbn,
  req.body.image_url,
  req.body.description];

  client.query(insert, values)
    .then(results => {
      console.error(error);
      res.sendStatus(500).send('Error inserting a book');
    });
});

function loadBooks() {
  client.query('SELECT COUNT(*) FROM books')
  .then(result => {
    if(!parseInt(result.rows[0].count)) {
      fs.readFile('./book.json', 'utf8', (err, fd) => {
        JSON.parse(fd).forEach(ele => {
          client.query(`INSERT INTO books(title, author, isbn, image_url, description)
          VALUES($1, $2 , $3, $4, $5)`, [ele.title, ele.author, ele.isbn, ele.image_url, ele.description])
          .catch(console.error);
        });
      });
    }
  })
}

