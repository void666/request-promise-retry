'use strict';
const requestPromise = require('request-promise');
const Promise = require('bluebird');
const logger = require('./modules/logger')('request-promise-retry');

class rpRetry {
    static _rpRetry(options) {
        if(options.verboseLogging) {
          logger.info(`calling ${options.uri} with retry ${options.retry}`);
        }
        const tries = options.retry || 1;
        delete options.retry;
        const fetchDataWithRetry = tryCount => {
            return requestPromise(options)
                .then(result => {
                    if(options.verbose_logging) {
                      logger.info(`Result obtained for ${options.method} request to ${options.uri}`);
                    }
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
        if(options.verboseLogging) {
          logger.info(`calling ${options.uri} without retries`);
        }
        return requestPromise(options)
            .then(result => {
                if(options.verbose_logging) {
                  logger.info(`Result obtained for ${options.method} request to ${options.uri}`);
                }
                return Promise.resolve(result);
            })
            .catch(err => {
                logger.info(`Encountered error ${err.message} for ${options.method} request to ${options.uri}`);
                return Promise.reject(err);
            });
    }

    static rp(options) {
        if (options.retry) {
            if (typeof options.retry === 'number') {
                if (options.retry < 0) {
                    return Promise.reject(new Error(`Retry count must be positive integer`));
                }
                return rpRetry._rpRetry(options);
            } else if (typeof options.retry === 'boolean') {
                options.retry = 1;
                return rpRetry._rpRetry(options);
            } else {
                return Promise.reject(new Error(`Supports boolean or positive integer`));
            }
        }
        return rpRetry._rp(options);
    }
}

module.exports = rpRetry.rp;
