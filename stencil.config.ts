import { Config } from "@stencil/core";

export const config: Config = {
  namespace: "aeiconscomponent",
  outputTargets: [
    {
      type: "dist"
    },
    {
      type: "www",
      serviceWorker: null
    }
  ]
};
