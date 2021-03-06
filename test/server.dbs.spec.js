'use strict';
const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = require('assert');
const server = require('../server');
const devUtils = require('../dev/dev.utils');
chai.should();
chai.use(chaiHttp);

suite('LuppoloDB', function () {
    suite('DB methods', function () {
        test('Delete DBs and persist', function (done) {
            chai.request(server)
            .get('/luppolo/dbs?_deleteAndPersist')
            .end((err, res) => {
                console.log(res.body);
                assert.deepEqual(res.body, devUtils.readJsonWithComments('./examples/dbs.delete.and.persist.json'));
                done();
            });
        });
        test('db1 not found', function (done) {
            chai.request(server)
            .get('/luppolo/db/db1')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.result.should.be.equal('unknown');
                console.log(res.body);
                done();
            });
        });
        test('create db1', function (done) {
            chai.request(server)
            .put('/luppolo/db/db1')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.result.should.be.equal('created');
                console.log(res.body);
                done();
            });
        });
        test('create key value', function (done) {
            chai.request(server)
            .put('/luppolo/db/db1/1')
            .send(devUtils.readJsonWithComments('./examples/value.object.json'))
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.result.should.be.equal('created');
                console.log(res.body);
                done();
            });
        });
        test('db1 exists', function (done) {
            chai.request(server)
            .put('/luppolo/db/db1')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.result.should.be.equal('exists');
                console.log(res.body);
                done();
            });
        });
        test('db1 found', function (done) {
            chai.request(server)
            .get('/luppolo/db/db1')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.result.should.be.equal('found');
                console.log(res.body);
                done();
            });
        });
        test('DBs export', function (done) {
            chai.request(server)
            .get('/luppolo/dbs?_export')
            .end((err, res) => {
                console.log(res.body);
                var expected = devUtils.readJsonWithComments('./examples/dbs.export.json');
                res.body.value.db1[1].lastUpdate.should.be.a('string');
                res.body.value.db1[1].lastUpdate = null;
                expected.value.db1[1].lastUpdate.should.be.a('string');
                expected.value.db1[1].lastUpdate = null;
                assert.deepEqual(res.body, expected);
                done();
            });
        });
        test('DBs persist', function (done) {
            chai.request(server)
            .get('/luppolo/dbs?_persist')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.result.should.be.equal('saved');
                res.body.db.should.be.equal('_all');
                console.log(res.body);
                done();
            });
        });
        test('delete db1', function (done) {
            chai.request(server)
            .delete('/luppolo/db/db1')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.result.should.be.equal('deleted');
                console.log(res.body);
                done();
            });
        });
        test('db1 not found', function (done) {
            chai.request(server)
            .get('/luppolo/db/db1')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.result.should.be.equal('unknown');
                console.log(res.body);
                done();
            });
        });
        test('DBs restore', function (done) {
            chai.request(server)
            .get('/luppolo/dbs?_restore')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.result.should.be.equal('restored');
                res.body.db.should.be.equal('_all');
                console.log(res.body);
                done();
            });
        });
        test('db1 found', function (done) {
            chai.request(server)
            .get('/luppolo/db/db1')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.result.should.be.equal('found');
                console.log(res.body);
                done();
            });
        });
        test('Delete DBs and persist', function (done) {
            chai.request(server)
            .get('/luppolo/dbs?_deleteAndPersist')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.result.should.be.equal('deleted');
                res.body.db.should.be.equal('_all');
                console.log(res.body);
                done();
            });
        });
    });
});
