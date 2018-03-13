'use strict';

const rp = require('../index');
const optionsWithRetryFail = {
    uri: 'http://adadadadad.com/',
    method: 'GET',
    retry: 3
};
const optionsWithoutRetryFail = {
    uri: 'http://adadadadad.com/',
    method: 'GET'
};
const optionsWithRetry = {
    uri: 'https://developer.github.com/v3/activity/events/#list-public-events-performed-by-a-user',
    method: 'GET',
    retry: 4
};

const optionsWithoutRetry = {
    uri: 'https://developer.github.com/v3/activity/events/#list-public-events-performed-by-a-user',
    method: 'GET'
};

describe('request-promise-retry', function () {
    it('should  pass, with retry options', () => {
        return rp(optionsWithRetry)
            .then(data => {
                expect(data.error).equal(undefined);
            });
    });
    it('fail and retry 3 times', () => {
        return rp(optionsWithRetryFail)
            .catch(err => {
                expect(err.error.code).equal('ENOTFOUND');
            });
    });
    it('should pass, without retry options', () => {
        return rp(optionsWithoutRetry)
            .then(data => {
                expect(data.error).equal(undefined);
            });
    });
    it('should fail, without retry options', () => {
        return rp(optionsWithoutRetryFail)
            .catch(err => {
                expect(err.error.code).equal('ENOTFOUND');
            });
    });
});
