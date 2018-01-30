const request = require('supertest')
const server = require('../server/server.js')
const fs = require('fs');


describe('Benchmarking', function() {
  it('Benchmarking Employee-Onchain', function(done) {
    var answerVar = 'function; gas cost;\n'
    request(server)
      .post('/employeeOnchain/create')
      .expect('Content-Type', /json/)
      .expect(200)
      .then( response => {
        answerVar = answerVar + "employee-create;" + response.body.content.transaction.gasUsed + "\n"
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
              answerVar = answerVar + "add;" + response.body.content.transaction.gasUsed + "\n"
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
                answerVar = answerVar + "payraise-create;" + response.body.content.transaction.gasUsed + "\n"
                const payraiseAddress = response.body.content.address
                request(server)
                .post('/employeeOnchain/increase-salary')
                .send({
                	"contractAddress": payraiseAddress
                })
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                  if (err) throw err;
                  answerVar = answerVar + "increase-salary;" + res.body.content.transaction.gasUsed + "\n"

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
      })
  });

  it('Benchmarking Employee', function(done) {
    var answerVar = 'function; gas cost;\n'
    request(server)
      .post('/employee/create')
      .expect('Content-Type', /json/)
      .expect(200)
      .then( response => {
        answerVar = answerVar + "employee-create;" + response.body.content.transaction.gasUsed + "\n"
        sleep(2000).then(() => {
          request(server)
            .post('/employee/add')
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
              answerVar = answerVar + "add;" + response.body.content.transaction.gasUsed + "\n"
              request(server)
              .post('/payraise/create')
              .send({
              	"percentage" : 15,
              	"department" : "IT",
              	"fromStartDate" : 1515942162
              })
              .expect('Content-Type', /json/)
              .expect(200)
              .then( response => {
                answerVar = answerVar + "payraise-create;" + response.body.content.transaction.gasUsed + "\n"
                const payraiseAddress = response.body.content.address
                request(server)
                .post('/employee/increase-salary')
                .send({
                	"contractAddress": payraiseAddress
                })
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                  if (err) throw err;
                  answerVar = answerVar + "increase-salary;" + res.body.content.transaction.gasUsed + "\n"

                  fs.writeFileSync("/middleware/benchmarking/employee.csv", answerVar, function(err) {
                      if(err) {
                          return console.log(err)
                      }
                  })
                  done()
                });
              })
            })
        })
      })
  });
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
