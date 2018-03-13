## request-promise-retry 
#### `npm : promise-request-retry`
[![npm version](https://badge.fury.io/js/promise-request-retry.svg)](https://badge.fury.io/js/promise-request-retry)
[![coverage status](https://coveralls.io/repos/github/void666/request-promise-retry/badge.svg)](https://coveralls.io/github/void666/request-promise-retry)
[![build status](https://travis-ci.org/void666/request-promise-retry.svg?branch=master)](https://travis-ci.org/void666/request-promise-retry)

Simple wrapper on top of [request-promise](https://github.com/request/request-promise) to replicate retry mechanism, i.e, it will try to reprocess the request till a valid response is obtained, or the number of retrys is exhausted. Supports all options from request-promise.

### Usage
-  additional parameter `retry` needed in `request-promise` options.
- `retry` supports boolean (defaults to `1` retry) and positive integer.
-  in order to ignore retry or use generic`request-promise`,just don't specify the `retry` parameter.

#### GET Request sample with retry
```
var rp = require('promise-request-retry');
var options = {
    uri: 'https://api.github.com/user/repos',
    qs: {
        access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx'
    },
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response, 
    retry : 2 // will retry the call twice, in case of error.
};

rp(options)
    .then(function (repos) {
        console.log('User has %d repos', repos.length);
    })
    .catch(function (err) {
        // API call failed...
    });
```
For rest of samples, please refer [`request-promise` documentation](https://github.com/request/request-promise).

### Installation
`npm install promise-request-retry`

### Test
`npm test`
