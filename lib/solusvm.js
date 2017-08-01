'use strict';

var rp = require('request-promise');
var Promise = require('bluebird');
var util = require('util');
var debug = require('debug')('solusvm');

var configuration = exports.configuration = {
    url: 'http://localhost',
    id: '',
    key: ''
};

exports.configure = function(url, id, key) {
    configuration.url = url;
    configuration.id = id;
    configuration.key = key;
};

var SolusError = exports.SolusError = function(message) {
    this.name = 'SolusError';
    this.message = message;
    Error.captureStackTrace(this, SolusError);
};

util.inherits(SolusError, Error);

exports.call = function(action, params, cb) {

    if(!params) {
        params = {};
    }

    var retPromise = new Promise(function(resolve, reject) {
        var url = configuration.url.replace(/\/+$/, '') + '/api/admin/command.php';

        params['action'] = action;
        params['id'] = configuration.id;
        params['key'] = configuration.key;
        params['rdtype'] = 'json';

        var options = {
            url: url,
            method: 'POST',
            form: params,
            resolveWithFullResponse: true
        };

        debug('Making SolusVM Request - url: %s action: %s', url,action);

        rp(options)
            .then(function(response) {
                debug('Successful SolusVM Request - url: %s action: %s', url, action);

                var jsonResponse = JSON.parse(response.body);
                if(jsonResponse.status != 'success') {
                    var err = new SolusError(jsonResponse.statusmsg);
                    reject(err);
                } else {
                    resolve(jsonResponse);
                }
            })
            .catch(function(err) {
                debug('SolusVM Request Error - url: %s action: %s msg: %s code: %s', url, action, err.msg, err.errorCode);
                reject(err);
            });
    });

    if(cb) {
        retPromise
            .then(function(response) {
                return cb(null, response);
            })
            .catch(function(err) {
                return cb(err);
            });
    }

    return retPromise;
};
