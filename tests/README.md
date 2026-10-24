# Tests

`platform.test.js` covers Windows mirror paths, quoting, environment and tunnel ownership. `ssh-forwarding.test.js` uses Windows system OpenSSH with an isolated loopback SSH fixture and temporary keys to verify reverse forwarding and reconnect; it is skipped on other platforms.

Run `npm test`; service and desktop integration checks are in `scripts/`. No real server credentials are required or stored.
