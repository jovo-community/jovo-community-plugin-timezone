import { BaseApp, HandleRequest, Jovo, Plugin, PluginConfig } from 'jovo-core';

export interface Config extends PluginConfig {
  defaultTimeZone?: string,
  defaultByLocaleCountryCode?: object,
}

export class TimeZonePlugin implements Plugin {
  config: Config = {
    defaultTimeZone: 'America/New_York'
  };

  private _jovo?: Jovo;

  constructor(config?: Config) {
    if (config) {
        this.config = {
            ...this.config,
            ...config,
        };
    }
    // this._jovo = null;
  }

  install(app: BaseApp) {
    Jovo.prototype.$timeZone = this;

    app.middleware('after.platform.init')!.use(this.initHandler.bind(this));

  }

  initHandler(handleRequest: HandleRequest) {
    const { jovo } = handleRequest;

    if (!jovo) {
        return;
    }

    this._jovo = jovo;
  }

  async getTimeZone() {
    if (!this._jovo) {
      return this.getDefaultTimeZone();
    }

    const platformType = this._jovo.getType();

    if (platformType === 'BixbyCapsule') {
      return this._jovo.$request.vivContext.timezone;
    }

    if (this._jovo.$session.$data.timeZone) {
      return this._jovo.$session.$data.timeZone;
    }

    if (platformType === 'AlexaSkill') {
      try {
        const result = await this._jovo.$alexaSkill.$user.getTimezone();
        this._jovo.$session.$data.timeZone = result;
      } catch (error) {
        this._jovo.$session.$data.timeZone = this.getDefaultTimeZone();
      }

      return this._jovo.$session.$data.timeZone;
    }

    if (platformType === 'GoogleAction') {
      // TODO: Use defaults until better Time Zone support
      this._jovo.$session.$data.timeZone = this.getDefaultTimeZone();

      return this._jovo.$session.$data.timeZone;
    }

    return this.getDefaultTimeZone();
  }

  getDefaultTimeZone() {
    if (!this._jovo) {
      return this.config.defaultTimeZone;
    }

    const locale = this._jovo.getLocale();
    if (!locale) {
      return this.config.defaultTimeZone;
    }

    const parts = locale.split('-');
    const countryCode = parts[parts.length - 1];

    if (!countryCode) {
      return this.config.defaultTimeZone;
    }

    const timezone = this.config.defaultByLocaleCountryCode[countryCode];
    if (timezone) {
      return timezone;
    }

    return this.config.defaultTimeZone;
  }

}

exports.TimeZonePlugin = TimeZonePlugin;
