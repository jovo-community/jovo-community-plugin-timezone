import { JovoTimeZone } from './JovoTimeZone';
import { TimeZonePlugin, TimeZonePluginConfig } from './TimeZonePlugin';

declare module '@jovotech/framework/dist/types/Extensible' {
  interface ExtensiblePluginConfig {
    TimeZonePlugin?: TimeZonePluginConfig;
  }

  interface ExtensiblePlugins {
    TimeZonePlugin?: TimeZonePlugin;
  }
}

declare module '@jovotech/framework/dist/types/Jovo' {
  interface Jovo {
    $timeZone: JovoTimeZone;
  }
}

export * from './TimeZonePlugin';
