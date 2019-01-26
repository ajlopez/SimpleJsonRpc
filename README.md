# SimpleJsonRpc

Simple JSON RPC client in JavaScript/NodeJS

## Installation

Via npm on Node:

```
npm install simplejsonrpc
```

## Usage

TBD

## References

TBD

## Samples

TBD

## Versions

- 0.0.1: Initial version
- 0.0.2: Using string address to create http provider
- 0.0.3: Sending application/json as content type
- 0.0.4: Support https as transport protocol
- 0.0.5: Send raw transaction
- 0.0.6: Support await/async

## About test using https

- [Ignore invalid self-signed ssl certificate in node.js with https.request?](https://stackoverflow.com/questions/10888610/ignore-invalid-self-signed-ssl-certificate-in-node-js-with-https-request)
- [OpenSSL Essentials: Working with SSL Certificates, Private Keys and CSRs](https://www.digitalocean.com/community/tutorials/openssl-essentials-working-with-ssl-certificates-private-keys-and-csrs)
- [Creating an HTTPS Server with Node.js](https://blog.cloudboost.io/everything-about-creating-an-https-server-using-node-js-2fc5c48a8d4e)

The files `test/private.key` and `test/private.crt` were generated with
```
openssl req -newkey rsa:2048 -nodes -keyout private.key -x509 -days 3650 -out private.crt
```

## Contribution

Feel free to [file issues](https://github.com/ajlopez/SimpleJsonRpc) and submit
[pull requests](https://github.com/ajlopez/SimpleJsonRpc/pulls) — contributions are
welcome.

If you submit a pull request, please be sure to add or update corresponding
test cases, and ensure that `npm test` continues to pass.

