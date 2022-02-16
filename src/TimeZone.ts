import { Jovo } from "jovo-core";
import type { BixbyRequest } from "jovo-platform-bixby";
import { AlexaSkill } from "jovo-platform-alexa";
import { Device } from "jovo-platform-googleassistantconv";

interface GoogleTimeZone {
  id: string;
  version: string;
}

export class TimeZone {
  jovo: Jovo;
  constructor(jovo: Jovo) {
    this.jovo = jovo;
  }
  async getTimeZone() {
    const platformType = this.jovo.getType();

    if (platformType === "BixbyCapsule") {
      return (this.jovo.$request! as BixbyRequest).vivContext!.timezone;
    }

    if (this.jovo.$session.$data.timeZone) {
      return this.jovo.$session.$data.timeZone;
    }

    if (platformType === "AlexaSkill") {
      try {
        const result = await (
          this.jovo.$alexaSkill! as AlexaSkill
        ).$user.getTimezone();

        this.jovo.$session.$data.timeZone = result
          ? result
          : this.getDefaultTimeZone();
      } catch (error) {
        this.jovo.$session.$data.timeZone = this.getDefaultTimeZone();
      }

      return this.jovo.$session.$data.timeZone;
    }

    if (platformType === "GoogleAction") {
      const device = (this.jovo.$request as any)?.device as Device | undefined;
      const timeZoneIfConversationalAction = device?.timeZone?.id;

      this.jovo.$session.$data.timeZone = timeZoneIfConversationalAction
        ? timeZoneIfConversationalAction
        : this.getDefaultTimeZone();

      return this.jovo.$session.$data.timeZone;
    }

    return this.getDefaultTimeZone();
  }

  getDefaultTimeZone() {
    const pluginConfig = this.jovo.$app.$plugins.get("TimeZonePlugin")!.config;

    if (!this.jovo) {
      return pluginConfig!.defaultTimeZone;
    }

    const locale = this.jovo.getLocale();
    if (!locale) {
      return pluginConfig!.defaultTimeZone;
    }

    const parts = locale.split("-");
    const countryCode = parts[parts.length - 1];

    if (!countryCode) {
      return pluginConfig!.defaultTimeZone;
    }

    const timezone = pluginConfig!.defaultByLocaleCountryCode[countryCode];
    if (timezone) {
      return timezone;
    }

    return pluginConfig!.defaultTimeZone;
  }
}
