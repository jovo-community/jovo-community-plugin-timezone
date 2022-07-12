import { Jovo } from '@jovotech/framework';
import { TimeZonePlugin, TimeZonePluginConfig } from './TimeZonePlugin';

export class JovoTimeZone {
  constructor(private timeZonePlugin: TimeZonePlugin, private jovo: Jovo) {}

  get config(): TimeZonePluginConfig {
    return this.timeZonePlugin.config;
  }

  async getTimeZone(): Promise<string> {
    // Return cached time zone
    if (this.jovo.$session.data.timeZone) {
      return this.jovo.$session.data.timeZone;
    }

    // Core/Web: Retrieve time zone from $request if set
    if (this.jovo.$request.timeZone) {
      this.jovo.$session.data.timeZone = this.jovo.$request.timeZone;
    }

    // Alexa: Retrieve time zone from Alexa API and cache it in session data
    if (this.jovo.$alexa) {
      try {
        const result = await this.jovo.$alexa.$device.getTimeZone();
        this.jovo.$session.data.timeZone = result ? result : this.defaultTimeZone;
      } catch (error) {
        this.jovo.$session.data.timeZone = this.defaultTimeZone;
      }
    }

    // Google Assistant: Retrieve time zone from request
    if (this.jovo.$googleAssistant?.$request.device?.timeZone) {
      this.jovo.$session.data.timeZone = this.jovo.$googleAssistant.$request.device.timeZone.id;
    }

    return this.jovo.$session.data.timeZone || this.defaultTimeZone;
  }

  get defaultTimeZone(): string {
    // If a default by country code is provided, return this one
    // e.g. { GB: 'Europe/London' }
    const locale = this.jovo.$request.getLocale();
    if (this.config.defaultTimeZoneByLocaleCountryCode && locale) {
      const parts = locale.split('-');
      const countryCode = parts[parts.length - 1];
      const timeZone = this.config.defaultTimeZoneByLocaleCountryCode[countryCode];
      if (timeZone) {
        return timeZone;
      }
    }
    return this.config.defaultTimeZone;
  }
}
