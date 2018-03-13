'use strict';

const rp = require('../index');
const optionsWithRetryFail = {
    uri: 'http://adadadadad.com/',
    method: 'GET',
    retry: 3
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

describe('rp', function () {
    it('it run with retry', () => {
        return rp(optionsWithRetry)
            .then(data => {
                expect(data.error).equal(undefined);
            });
    });
    it('it run with retry, and fail 3 times', () => {
        return rp(optionsWithRetryFail)
            .catch(err => {
                expect(err.error.code).equal('ENOTFOUND');
            });
    });
    it('it run without retry', () => {
        return rp(optionsWithoutRetry)
            .then(data => {
                expect(data.error).equal(undefined);
            });
    });
});
