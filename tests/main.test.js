/**
 * Module dev dependencies.
 */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
// let should = chai.should();

chai.use(chaiHttp);

describe('Books', () => {
    // Test the main route
    describe('GET /', () => {
        it('it should load home page', (done) => {
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
    // Test bad request
    describe('GET /invalid', () => {
        it('it should get bad request', (done) => {
            chai.request(server)
                .get('/invalid')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.error.should.equal('Bad request')
                    done();
                });
        });
    });
    // Test the /explorer API route
    describe('GET /explorer', () => {
        it('it should return cost details', (done) => {
            chai.request(server)
                .get('/explorer?cost_type_id[]=7&project_id[]=32&project_id[]=16')
                .end((err, res) => {
                    res.should.have.status(200);
                    if (res.status === 200) {
                        res.body.data.length.should.equal(1);
                    }
                    done();
                });
        });
    });
});