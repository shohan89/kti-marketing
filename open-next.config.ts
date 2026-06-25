import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import { resolve } from "path";

export default defineCloudflareConfig({
  esbuildOptions: {
    external: ["pg-native"],
    nodePaths: [resolve("node_modules")],
  },
});
