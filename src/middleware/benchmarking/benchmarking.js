const request = require('supertest')

// const express = require('express');
//
// const app = express();

const server = require('../server/server.js')


//const server = require('../server/server.js')
//const api = require('../api/api.js')

console.log("I got called.")

console.log("server:")
console.log(server)

console.log("call create")
request(server)
  .post('/employeeOnchain/create')
  .expect('Content-Type', /json/)
  .expect(200)
  .then( response => {
    request(server)
      .post('/employeeOnchain/add')
      .expect('Content-Type', /json/)
      .expect(200)
      .then( response => {
        request(server)
          .post('/employeeOnchain/increase-salary')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            if (err) throw err;
          });
      })
      /*.end(function(err, res) {
        if (err) throw err;
      });*/
  })
  /*.end(function(err, res) {
    if (err) throw err;

  })*/
console.log("create called.")
