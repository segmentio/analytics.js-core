# analytics.js-core

[![CircleCI](https://circleci.com/gh/segmentio/analytics.js-core.svg?style=shield&circle-token=802e83e9a76e911d83be24df8497b6283ee5dfeb)](https://circleci.com/gh/segmentio/analytics.js-core)
[![Codecov](https://img.shields.io/codecov/c/github/segmentio/analytics.js-core/master.svg?maxAge=2592000)](https://codecov.io/gh/segmentio/analytics.js-core)

This is the core of [Analytics.js][], the open-source library that powers data collection at [Segment](https://segment.com).

To build this into a full, usable library, see the [Analytics.js](https://github.com/segmentio/analytics.js) repository.

## License

Released under the [MIT license](License.md).

[analytics.js]: https://segment.com/docs/libraries/analytics.js/

## Releasing

1. Update the version in `package.json`.
2. Run `robo release x.y.z` where `x.y.z` is the new version.
