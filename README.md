# Time Zone Jovo Plugin
## Overview

This plugin for the [Jovo Framework](https://github.com/jovotech/jovo-framework) `v4` allows you to easily add cross-platform time zone support including an overall default time zone if there is not a country-code-specific default.

## Platforms

The following platforms are supported:

- Amazon Alexa
- Google Assistant

In the case of Amazon Alexa, after the first API call, the time zone is cached in [Session Data](https://www.jovo.tech/docs/data#session-data) at:

```typescript
this.jovo.$session.data.$timeZone
```

Don't access or change this value, instead use the method on the plugin:

```js
const tz = await this.$timeZone.getTimeZone();
```

## Install

Install the plugin into your Jovo project:

```sh
npm install jovo-community-plugin-timezone
```

Register the plugin in `app.ts`:

```typescript
import { TimeZonePlugin } from 'jovo-community-plugin-timezone';

const app = new App({
  // ...

  plugins: [
    new TimeZonePlugin(),

    // ...
  ],
}
```

Get the time zone in your handler:

```typescript
const tz = await this.$timeZone.getTimeZone();
```

## Configuration

You can set an overall default time zone fallback or defaults based on the country code portion of the locale that is sent with every request.

```typescript
import { TimeZonePlugin } from 'jovo-community-plugin-timezone';

const app = new App({
  // ...

  plugins: [
    new TimeZonePlugin({
      defaultTimeZone: 'America/New_York',
      defaultTimeZoneByLocaleCountryCode: {
        US: 'America/New_York',
        GB: 'Europe/London',
        CA: 'America/Toronto',
        AU: 'Australia/Sydney',
        IN: 'Asia/Kolkata',
      },
    }),

    // ...
  ],
}
```

# License

MIT
