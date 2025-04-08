import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: {
    extends: "eslint:recommended"
  }
});

// 正しいフラット設定形式を使用
export default [
  ...compat.config({
    extends: ["next/core-web-vitals"]
  }),
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off"
    }
  }
];
