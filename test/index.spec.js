'use strict';

var chai = require('chai');
var nock = require('nock');
var path = require('path');

var solusvm = require('../');
var expect = chai.expect;

describe('solusvm', function() {

    describe('client configuration works', function() {
        var testUrl = 'http://example.com';
        var testId = 'testid';
        var testKey = 'testkey';

        it('default configuration', function(done) {
            expect(solusvm.configuration.url).to.eql('http://localhost');
            expect(solusvm.configuration.id).to.eql('');
            expect(solusvm.configuration.key).to.eql('');
            done();
        });

        it('sets configurations', function(done) {
            solusvm.configure(testUrl, testId, testKey);
            expect(solusvm.configuration.url).to.eql(testUrl);
            expect(solusvm.configuration.id).to.eql(testId);
            expect(solusvm.configuration.key).to.eql(testKey);
            done();
        });
    });

    describe('call() without callback', function() {

        nock.load(path.join(__dirname, 'nocks.json'));

        it('returns a promise', function(done) {
            var p = solusvm.call('client-checkexists', {'username':'test'});
            expect(p.constructor.name).to.equal('Promise');
            expect(p.then).to.be.a('function');
            expect(p.delay).to.be.a('function');
            expect(p.map).to.be.a('function');
            expect(p.cancel).to.be.a('function');
            done();
        });

        describe('successful request', function() {
            it('returns expected response', function(done) {
                solusvm.call('client-checkexists', {'username':'user'})
                    .then(function(data) {
                        expect(data).to.deep.equal({
                            'status': 'success',
                            'statusmsg': 'Client exists'
                        });
                        done();
                    })
                    .catch(function(err) {
                        done(err);
                    });
            });
        });

        describe('request without arguments', function() {
            it('returns expected response', function(done) {
                solusvm.call('client-list')
                    .then(function(data) {
                        expect(data).to.deep.equal({
                            'status': 'success',
                            'statusmsg': '',
                            'clients': []
                        });
                        done();
                    })
                    .catch(function(err) {
                        done(err);
                    });
            });
        });

        describe('invalid request', function() {
            it('returns a SolusError', function(done) {
                solusvm.call('client-checkexists', {'username':'invalid'})
                    .catch(function(err) {
                        expect(err instanceof solusvm.SolusError).to.be.true;
                        done();
                    });
            });
        });

        describe('failed request', function() {
            it('returns an Error', function(done) {
                solusvm.call('client-checkexists', {'username':'failed'})
                    .catch(function(err) {
                        expect(err instanceof Error).to.be.true;
                        done();
                    });
            });
        });
    });

    describe('call() with callback', function() {

        nock.load(path.join(__dirname, 'nocks.json'));

        describe('successful request', function() {
            it('returns expected response', function(done) {
                solusvm.call('client-checkexists', {'username':'test'}, function(err, data) {
                    expect(data).to.deep.equal({
                        'status': 'success',
                        'statusmsg': 'Client exists'
                    });
                    done();
                });
            });
        });

        describe('invalid request', function() {
            it('returns a SolusError', function(done) {
                solusvm.call('client-checkexists', {'username':'invalid'}, function(err) {
                    expect(err instanceof solusvm.SolusError).to.be.true;
                    done();
                });
            });
        });

        describe('failed request', function() {
            it('returns an Error', function(done) {
                solusvm.call('client-checkexists', {'username':'failed'}, function(err) {
                    expect(err instanceof Error).to.be.true;
                    done();
                });
            });
        });
    });
});
