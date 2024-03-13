import { defineConfig } from "@umijs/max";
import { join } from "path";

export default defineConfig({
  plugins: ["@medalsoft/umi-plugins/dist/openapi"],
  openAPI: [
    {
      projectName: "demoPet",
      requestLibPath: "import {request} from'@umijs/max'",
      apiPrefix: "process.env.API_PREFIX_BASE",
      schemaPath: join(__dirname, "oneapi.json"),
      mock: false,
    },
    // {
    //   projectName: "jciService",
    //   requestLibPath: "import {request} from'@umijs/max'",
    //   namespace: "API_JCI",
    //   apiPrefix: "process.env.API_PREFIX_BASE",
    // schemaPath: "https://pdp-webapp.chinacloudsites.cn/swagger/JCIPDP.API/swagger.json",
    //   mock: false,
    // },
  ],
});
