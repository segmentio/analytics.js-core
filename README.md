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

If you create a source at https://app.segment.com, Segement automatically generates a JS snippet that you can add to your website. (for more information visit our [documentation](https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/quickstart/)).

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

## Using as a standalone `npm` package
We recommend using the CDN version of `analytics.js` as it offers all the project and workspace specific settings, enabled integrations, and middleware. But if you prefer to use `analytics.js-core` as a standalone npm package using your own tooling & workflow, you can do the following: 

1- Install the dependencies 
```
yarn add @segment/analytics.js-core
yarn add @segment/analytics.js-integration-segmentio
// you may need this depending on the bundler
yarn add uuid@^3.4 
```

2- Import the dependencies 
```javascript
import Analytics from "@segment/analytics.js-core/build/analytics";
import SegmentIntegration from "@segment/analytics.js-integration-segmentio";
```

3- Initialize Segment and add Segment's own integration 
```javascript
// instantiate the library
const analytics = new Analytics();

// add Segment's own integration ( or any other device mode integration ) 
analytics.use(SegmentIntegration);

// define the integration settings object. 
// Since we are using only Segment integration in this example, we only have 
// "Segment.io" in the integrationSettings object
const integrationSettings = {
  "Segment.io": {
    apiKey: "<YOUR SEGMENT WRITE KEY>",
    retryQueue: true,
    addBundledMetadata: true
  }
};


// Initialize the library
analytics.initialize(integrationSettings);

// Happy tracking! 
analytics.track('🚀');
```

## License

Released under the [MIT license](LICENSE).

[analytics.js]: https://segment.com/docs/libraries/analytics.js/
