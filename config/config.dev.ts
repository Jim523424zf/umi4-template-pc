import { defineConfig } from "@umijs/max";

export default defineConfig({
  define: {
    "process.env.ENV": "dev",
    "process.env.API_PREFIX_BASE": "",
    "process.env.LoginRedirectH5": "",
    "process.env.AADRedirectUrl": "http://localhost:8020",
    "process.env.AADClientId": "d2b7a464-34fa-4f92-855d-1eefee195cd3", // 应用程序(客户端) ID
    "process.env.AADTenantId": "44c24f42-d49b-4192-9336-5f2989b87356", // 目录(租户) ID
    "process.env.AADScope": "api://d2b7a464-34fa-4f92-855d-1eefee195cd3/user", // 应用程序 ID URI
    "process.env.AADHomePagePath": "/internal/home",
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
