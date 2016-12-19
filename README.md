#S3 Link Redirector

Link redirection via AWS S3

## Getting Started

```sh
npm install ravirahman/S3-Link-Redirector --save
```

Then, in your code:

```javascript
const redirector = require('S3-Link-Redirector');
const links = {
    "a": {
        "b": {
            "c": ["https://example.com/1", 3600] //redirects /a/b/c to https://example.com/1, cached for 1hr (3600s)
        },
        "d": ["https://example.com/2", 86400] //redirects /a/d to https://example.com/2, cached for 1 day (86400s)
    },
    "e": ["https://example.com/3"] //redirects /e to https://example.com/3, with no cache
};
const options = {
    bucket: "", //AWS S3 Bucket in which to create the redirects (required)
    region: "", //AWS Region (optional, can pass via env vars)
    accessKeyId: "", //AWS Access Key Id (optional, can pass via env vars)
    secretAccessKey: "", //AWS Secret Access Key (optional, can pass via env vars)
    sessionToken: "" //AWS Session Token (optional, can pass via env vars)
};
redirector(options, links, callback); //returns an ES6 Promise, fulfilled after all links have been deployed
```

## Notes
- This package adds or updates, but does not remove, redirects. To remove a redirect, manually empty the bucket, and then re-run. 
- Fixed a Bug Fixes / Have an Improvement? Please fork, and submit a pull request. Thanks!

## License
Apache 2.0
