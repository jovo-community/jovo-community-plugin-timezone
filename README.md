# Time Zone Jovo Plugin

[![NPM](https://nodei.co/npm/jovo-community-plugin-timezone.png)](https://nodei.co/npm/jovo-community-plugin-timezone/)

![Node CI](https://github.com/jovo-community/jovo-community-plugin-timezone/workflows/Build/badge.svg)

## Overview
This plugin for the [Jovo Framework](https://github.com/jovotech/jovo-framework) allows you to easily add cross-platform time zone support including an overall default time zone if there is not a country-code-specific default.


## Platforms
The following platforms are supported:
* Amazon Alexa
* Google Assistant
* Samsung Bixby

In the case of Amazon Alexa, after the first API call, the time zone is cached in Session Data at:

`this.jovo.$session.$data.$timeZone`

Don't access or change this value, instead use the method on the plugin:

```js
const tz = await this.$timeZone.getTimeZone();
```


NOTE: Support for Google Assistant is through default time zone only as the current User Experience (UX) of prompting for location and calling APIs to convert geo-location into a time zone needs improvement.


## Install
Install the plugin into your Jovo project:

`npm install jovo-community-plugin-timezone --save`

Register the plugin in:

app.js:
```javascript
const { TimeZonePlugin } = require('jovo-community-plugin-timezone');


app.use(
    // ... base imports
    new TimeZonePlugin()
);
```


app.ts:
```typescript
import { TimeZonePlugin } from 'jovo-community-plugin-timezone';

app.use(
    // ... base imports
    new TimeZonePlugin()
);
```

Get the time zone in your handler:

myHandler.js or myHandler.ts:
```javascript
const tz = await this.$timeZone.getTimeZone();
```


## Configuration

You can set an overall default time zone fallback or defaults based on the country code portion of the locale that is sent with every request.

config.js or config.ts:
```javascript
plugin: {
  TimeZonePlugin: {
    defaultTimeZone: 'America/New_York',
    defaultByLocaleCountryCode: {
      US: 'America/New_York',
      GB: 'Europe/London',
      CA: 'America/Toronto',
      AU: 'Australia/Sydney',
      IN: 'Asia/Kolkata',
    },
  },
},
```

# License

MIT