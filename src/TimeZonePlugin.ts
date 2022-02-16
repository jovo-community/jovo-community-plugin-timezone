import { BaseApp, HandleRequest, Plugin, PluginConfig } from "jovo-core";
import { TimeZone } from "./TimeZone";

export interface Config extends PluginConfig {
  defaultTimeZone?: string;
  defaultByLocaleCountryCode?: object;
}

declare module "jovo-core/dist/src/core/Jovo" {
  export interface Jovo {
    $timeZone: TimeZone;
  }
}

export class TimeZonePlugin implements Plugin {
  config: Config = {
    defaultTimeZone: "America/New_York",
  };

  constructor(config?: Config) {
    if (config) {
      this.config = {
        ...this.config,
        ...config,
      };
    }
  }

  install(app: BaseApp) {
    app.middleware("after.platform.init")!.use(this.initHandler.bind(this));
  }

  initHandler(handleRequest: HandleRequest) {
    const { jovo } = handleRequest;
    if (!jovo) {
      return;
    }
    jovo.$timeZone = new TimeZone(jovo);
  }
}
