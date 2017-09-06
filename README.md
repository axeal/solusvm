# SolusVM

[![Build Status](https://travis-ci.org/axeal/solusvm.svg?branch=master)](https://travis-ci.org/axeal/solusvm)
[![Coverage Status](https://coveralls.io/repos/github/axeal/solusvm/badge.svg?branch=master)](https://coveralls.io/github/axeal/solusvm?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/axeal/solusvm/badge.svg)](https://snyk.io/test/github/axeal/solusvm)

A SolusVM Admin API Wrapper

## Installation 
This module can be install via npm:
```text
$ npm install --save solusvm
```

## Usage

The `solusvm.call()` method accepts three arguments:
1. The name of the SolusVM API action to call
2. An object with the variables for the API call
3. An optional callback function

If no callback function is passed to the call then a promise is returned. To use a callback instead, pass a callback function as the third argument.

```javascript
var solusvm = require('solusvm');

//Configrure the API client with the URL, API ID and API KEY of the SolusVM Master Instance
solusvm.configure('url', 'apiId', 'apiKey');

//Example of a promise-based call to the client
solusvm.call('node-idlist', {
    type: 'openvz'
  })
  .then(function(data) {
    console.log(data);
  })
  .catch(function(err) {
    console.log(err);
  });

//Example of a callback-based call to the client
solusvm.call('node-idlist', {
    type: 'openvz'
  }, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  });
 ```