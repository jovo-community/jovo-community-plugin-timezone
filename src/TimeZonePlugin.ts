import {
  Jovo,
  HandleRequest,
  Plugin,
  PluginConfig,
  Extensible,
  InvalidParentError,
} from '@jovotech/framework';
import { JovoTimeZone } from './JovoTimeZone';

export interface TimeZonePluginConfig extends PluginConfig {
  defaultTimeZone: string;
  defaultTimeZoneByLocaleCountryCode?: {
    [key: string]: string;
  };
}

export class TimeZonePlugin extends Plugin<TimeZonePluginConfig> {
  constructor(config?: TimeZonePluginConfig) {
    super(config);
  }

  mount(extensible: Extensible) {
    if (!(extensible instanceof HandleRequest)) {
      throw new InvalidParentError(this.constructor.name, HandleRequest);
    }
    extensible.middlewareCollection.use('request.end', (jovo: Jovo) => {
      jovo.$timeZone = new JovoTimeZone(this, jovo);
    });
  }

  getDefaultConfig(): TimeZonePluginConfig {
    return { defaultTimeZone: 'America/New_York' };
  }
}
