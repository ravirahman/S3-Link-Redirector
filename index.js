"use strict";

const AWS = require('aws-sdk');
const Immutable = require('immutable');
const path = require('path');

const s3 = new AWS.S3();

module.exports = (links, options, cb) => {
    if (options.accessKeyId) {
        AWS.config.accessKeyId = options.accessKeyId;
    }
    if (options.secretAccessKey) {
        AWS.config.secretAccessKey = options.secretAccessKey;
    }
    if (options.sessionToken) {
        AWS.config.sessionToken = options.sessionToken;
    }
    if (options.region) {
        AWS.region = options.region;
    }
    const reduceEntry = (promises, entry) => {
        return entry.reduce((promises, subEntry, key) => {
            const resource = path.join(entry.get('resource', "/"), key);
            if (Immutable.Map.isMap(subEntry)) { //contains sub-resources
                return reduceEntry(subEntry.set('resource', resource));
            }
            if (Immutable.List.isList(subEntry)) {
                //otherwise it would be a set/tuple of [location, cache time]
                return promises.push(new Promise((resolve, reject) => {
                    s3.putObject({
                        Bucket: options.bucket,
                        Key: resource,
                        CacheControl: `max-age=${subEntry.get(1, 0)}`,
                        ContentLength: 0,
                        ContentType: 'text/html',
                        Metadata: {
                            WebsiteRedirectLocation: subEntry.get(0)
                        }
                    }, (err) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve();
                    });
                }));
            }
            //if it's anything else, then it's config data. ignore
            return promises;
        }, promises);
    };
    const promises = reduceEntry(new Immutable.List(), Immutable.fromJS(links));

    return Promise.all(promises).then(() => {
        if (cb) {
            return cb()
        }
    }, (err) => {
        if (cb) {
            return cb(err);
        }
    });
};

