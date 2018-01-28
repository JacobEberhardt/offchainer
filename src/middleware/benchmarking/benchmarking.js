const request = require('supertest')

// const express = require('express');
//
// const app = express();

const server = require('../server/server.js')


const fs = require('fs');

//const server = require('../server/server.js')
//const api = require('../api/api.js')

console.log("I got called.")

//console.log("server:")
//console.log(server)


console.log("call create")
describe('first test', function() {
  it('first test it', function(done) {
    var answerVar = 'function; gas cost;\n'
    request(server)
      .post('/employeeOnchain/create')
      .expect('Content-Type', /json/)
      .expect(200)
      .then( response => {
        answerVar = answerVar + "employee-create; " + response.body.content.transaction.gasUsed + "\n"
        sleep(2000).then(() => {
          request(server)
            .post('/employeeOnchain/add')
            .send({
            	"firstName" : "Adam",
            	"lastName" : "Miller",
            	"startDate" : 1515942162,
            	"department" : "IT",
            	"salary" : 2000
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .then( response => {
              answerVar = answerVar + "add; " + response.body.content.transaction.gasUsed + "\n"
              request(server)
              .post('/payraiseOnchain/create')
              .send({
              	"percentage" : 15,
              	"department" : "IT",
              	"fromStartDate" : 1515942162
              })
              .expect('Content-Type', /json/)
              .expect(200)
              .then( response => {
                answerVar = answerVar + ', ' + response.body.status
                console.log("respone from payraise-create:")
                //console.log(response)
                console.log("relevant parts: \n\n")
                const payraiseAddress = response.body.content.address
              //  console.log(payraiseAddress)
                console.log("lol")
                request(server)
                .post('/employeeOnchain/increase-salary')
                .send({
                	"contractAddress": payraiseAddress
                })
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                  if (err) throw err;
                  answerVar = answerVar + ', ' + res.body.status
                  console.log(answerVar)
                  console.log("answerVar ende")

                  fs.writeFileSync("/middleware/benchmarking/employeeOnchain.csv", answerVar, function(err) {
                      if(err) {
                          return console.log(err)
                      }
                  })
                  done()
                });
              })





            })
        })

          /*.end(function(err, res) {
            if (err) throw err;
          });*/
      })
  });
});

  /*.end(function(err, res) {
    if (err) throw err;

  })*/
console.log("create called.")


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
