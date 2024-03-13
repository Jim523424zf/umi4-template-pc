import { defineConfig } from "@umijs/max";

/**
 * 编译配置
 */
export default defineConfig({
  npmClient: "pnpm",
  verifyCommit: {
    scope: ["feat", "fix", "other", "merge"],
    allowEmoji: true,
  },
  esbuildMinifyIIFE: true,
  hash: true,
});
