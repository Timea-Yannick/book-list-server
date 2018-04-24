'use strict';

const pg = require('pg');
const fs = require('fs');
const express = require('express');
const app = express();
const PORT = process.env.PORT;

const conString = '';
const CLIENT = new pg.Client(conString);
client.connect();

client.on('error', err => {
  console.error(err);
});



