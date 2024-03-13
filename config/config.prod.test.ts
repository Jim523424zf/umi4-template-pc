import { defineConfig } from "@umijs/max";

export default defineConfig({
  define: {
    "process.env.ENV": "test",
    "process.env.API_PREFIX_BASE": "",
    "process.env.LoginRedirectH5": "",
    "process.env.AADRedirectUrl": "",
    "process.env.AADClientId": "",
    "process.env.AADTenantId": "",
    "process.env.AADScope": "",
    "process.env.AADHomePagePath": "",
    "process.env.B2CRedirectUrl": "",
    "process.env.B2CClientId": "",
    "process.env.B2CAuthority": "",
    "process.env.B2CHost": "",
    "process.env.B2CScope": "",
    "process.env.B2CHomePagePath": "",
    "process.env.WeComRedirectUrl": "",
    "process.env.WeComHomePagePath": "",
  },
});
