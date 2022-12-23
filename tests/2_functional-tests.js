/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = process.env.SERVER;

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('Routing tests', function() {

    let testId;
    let deleteId;

    suite('POST /api/books with title => create book object/expect book object', function() {

      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post("/api/books")
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({
            title: "Candide"
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.isDefined(res.body._id, 'Book should contain _id');
            assert.isDefined(res.body.title, 'Book should contain title');
            done();
          })
      });

      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post("/api/books")
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({
            title: ""
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field title');
            done();
          })
      });
    });


    suite('GET /api/books => array of books', function() {
      test('Test GET /api/books', function(done) {
        chai.request(server)
          .get('/api/books')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.isArray(res.body[0].comments, 'Book objects in array should contain comments property as an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            assert.property(res.body[0], '__v', 'Books in array should contain __v');
            testId = res.body[0]._id;
            deleteId = res.body[1]._id;
            done();
          });
      });
    });


    suite('GET /api/books/[id] => book object with [id]', function() {

      test('Test GET /api/books/[id] with id not in db', function(done) {
        chai.request(server)
          .get('/api/books/foobar')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'no book exists');
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function(done) {
        chai.request(server)
          .get(`/api/books/${testId}`)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.isArray(res.body.comments, 'Book objects should contain comments property as an array');
            assert.property(res.body, 'commentcount', 'Book should contain commentcount');
            assert.property(res.body, 'title', 'Book should contain title');
            assert.property(res.body, '_id', 'Book should contain _id');
            assert.property(res.body, '__v', 'Book should contain __v');
            done();
          });
      });
    });

    suite('POST /api/books/[id] => add comment/expect book object with id', function() {

      test('Test POST /api/books/[id] with comment', function(done) {
        chai.request(server)
          .post(`/api/books/${testId}`)
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({
            comment: "Nice book"
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.isArray(res.body.comments);
            assert.isDefined(res.body.comments[0]);
            assert.isAbove(res.body.commentcount, 0);
            assert.property(res.body, 'title');
            assert.equal(res.body._id, testId);
            assert.property(res.body, '__v');
            done();
          })
      });

      test('Test POST /api/books/[id] without comment field', function(done) {
        chai.request(server)
          .post(`/api/books/${testId}`)
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({
            comment: ""
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, '"missing required field comment"');
            done();
          })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done) {
        chai.request(server)
          .post(`/api/books/foobar`)
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({
            comment: "Nice"
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, '"no book exists"');
            done();
          })
      });
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done) {
        chai.request(server)
          .delete(`/api/books/${deleteId}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, '"delete successful"');
            done()
          })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done) {
        chai.request(server)
          .delete(`/api/books/foobar`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, '"no book exists"');
            done()
          })
      });

    });

  });

});
