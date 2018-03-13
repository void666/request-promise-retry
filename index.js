'use strict';
const requestPromise = require('request-promise');
const Promise = require('bluebird');
const logger = require('./modules/logger')('request-promise-retry');

class rpRetry {
    static _rpRetry(options) {
        logger.info(`calling ${options.uri} with retry ${options.retry}`);
        const tries = options.retry || 1;
        delete options.retry;
        const fetchDataWithRetry = tryCount => {
            return requestPromise(options)
                .then(result => {
                    logger.info(`Result obtained for ${options.method} request to ${options.uri}`);
                    return Promise.resolve(result);
                })
                .catch(err => {
                    logger.info(`Encountered error ${err.message} for ${options.method} request to ${options.uri}, retry count ${tryCount}`);
                    tryCount -= 1;
                    if (tryCount) {
                        return fetchDataWithRetry(tryCount);
                    }
                    return Promise.reject(err);
                });
        };
        return fetchDataWithRetry(tries);
    }

    static _rp(options) {
        logger.info(`calling ${options.uri} without retries`);
        return requestPromise(options)
            .then(result => {
                logger.info(`Result obtained for ${options.method} request to ${options.uri}`);
                return Promise.resolve(result);
            })
            .catch(err => {
                logger.info(`Encountered error ${err.message} for ${options.method} request to ${options.uri}`);
                return Promise.reject(err);
            });
    }

    static rp(options) {
        if (options.retry) {
            return rpRetry._rpRetry(options);
        }
        return rpRetry._rp(options);
    }
}

module.exports = rpRetry.rp;