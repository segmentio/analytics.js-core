# analytics.js-core

[![CircleCI](https://circleci.com/gh/segmentio/analytics.js-core.svg?style=shield)](https://circleci.com/gh/segmentio/analytics.js-core)
[![Codecov](https://img.shields.io/codecov/c/github/segmentio/analytics.js-core/master.svg)](https://codecov.io/gh/segmentio/analytics.js-core)

This is the core of [Analytics.js](https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/), the open-source library that powers data collection at [Segment](https://segment.com).

To build this into a full, usable library, see the [Analytics.js](https://github.com/segmentio/analytics.js) repository.

## Using Types (v.4.0.0-beta.0 and later)

We recently introduced Typescript support and types to Analytics.js Core. While the exposed types still need some work (pull requests are welcome!), they're ready to be used.

### Importing as an npm module

If you use analytics.js-core as an npm module, you can use its types out of the box:
<img src="https://user-images.githubusercontent.com/484013/89060070-2e235f00-d317-11ea-9fd9-e1c77aaca9f9.gif" alt="Example of Types usage in Analytics JS" width="500px">

### Using types with the AJS Snippet

If you create a source at https://app.segment.com, Segement automatically generates a JS snippet that you can add to your website. (for more information visit our [documentation](https://segment.com/docs/getting-started/02-simple-install/#installing-segment)).

To use types with the snippet, add `analytics` as part of the global module.
Something like this:

```typescript
import { SegmentAnalytics } from '@segment/analytics.js-core';

declare global {
  interface Window {
    analytics: SegmentAnalytics.AnalyticsJS;
  }
}
```

## License

Released under the [MIT license](LICENSE).

[analytics.js]: https://segment.com/docs/libraries/analytics.js/
