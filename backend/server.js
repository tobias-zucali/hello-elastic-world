'use strict';

const db = require('./db');

const express = require('express');
const app = express();

// NOTE: We implement only GET handlers here, because:
//
// 1. This demo is to be tested by typing URL-s manually in the browser;
// 2. The demo's focus is on a proper database layer, not a web server.

//////////////////////////////////////////////
// Users Web API
//////////////////////////////////////////////

// create table Users:
GET('/api/users/create', () => db.users.create());

// add some initial records:
GET('/api/users/init', () => db.users.init());

// remove all records from the table:
GET('/api/users/empty', () => db.users.empty());

// drop the table:
GET('/api/users/drop', () => db.users.drop());

// add a new user, if it doesn't exist yet, and return the object:
GET('/api/users/add/:name', req => {
  return db.task('add-user', t => {
    return t.users.findByName(
      req.params.name
    ).then(user => {
      return user || t.users.add(req.params.name);
    });
  });
});

// find a user by id:
GET('/api/users/find/:id', req => db.users.findById(req.params.id));

// remove a user by id:
GET('/api/users/remove/:id', req => db.users.remove(req.params.id));

// get all users:
GET('/api/users', () => db.users.all());

// count all users:
GET('/api/users/total', () => db.users.total());

//////////////////////////////////////////////
// Products Web API
//////////////////////////////////////////////

// create table Products:
GET('/api/products/create', () => db.products.create());

// drop the table:
GET('/api/products/drop', () => db.products.drop());

// remove all products:
GET('/api/products/empty', () => db.products.empty());

// add a new user product, if it doesn't exist yet, and return the object:
GET('/api/products/add/:userId/:name', req => {
  return db.task('add-product', t => {
    return t.products.find(
      req.params
    ).then(product => {
      return product || t.products.add(req.params);
    });
  });
});

// find a product by user id + product name id:
GET('/api/products/find/:userId/:name', req => db.products.find(req.params));

// remove a product by id:
GET('/api/products/remove/:id', req => db.products.remove(req.params.id));

// get all products:
GET('/api/products/all', () => db.products.all());

// count all products:
GET('/api/products/total', () => db.products.total());

/////////////////////////////////////////////
// pubsub
/////////////////////////////////////////////

db.connect({direct: true})
    .then(sco => {
        sco.client.on('notification', data => {
            console.log('Received:', JSON.parse(data.payload));
            // data.payload = 'my payload string'
        });
        return sco.none('LISTEN $1~', 'users');
    })
    .catch(error => {
        console.log('Error:', error);
    });

/////////////////////////////////////////////
// Express/server part;
/////////////////////////////////////////////

// Generic GET handler;
function GET(url, handler) {
  app.get(url, (req, res) => {
    handler(req).then(data => {
      res.json({
        success: true,
        data
      });
    }).catch(error => {
      res.json({
        success: false,
        error: error.message || error
      });
    });
  });
}

const port = 3001;

app.listen(port, () => {
  console.log('\nReady for GET requests on http://localhost:' + port);
});
